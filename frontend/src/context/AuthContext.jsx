import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  sendPasswordResetEmail, 
  sendEmailVerification, 
  updateProfile,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db, isFirebaseConfigured } from '../firebase/firebase';
import { authApi, authStorage, studentApi } from '../services/api';
import { promptGoogleSignIn } from '../services/googleAuthService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const u = authStorage.getUser();
    if (u) {
      const resolvedName = u.fullName || u.name || (u.email ? u.email.split('@')[0] : 'AVENTO User');
      return { ...u, fullName: resolvedName, name: resolvedName };
    }
    return null;
  });
  const [token, setToken] = useState(() => authStorage.getToken());
  const [loading, setLoading] = useState(true);
  const [registeredEventIds, setRegisteredEventIds] = useState(() => {
    try {
      const cached = localStorage.getItem('avento_registered_event_ids');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  const refreshUserRegistrations = useCallback(async () => {
    const activeUser = authStorage.getUser();
    if (!activeUser?.email) {
      setRegisteredEventIds([]);
      try { localStorage.removeItem('avento_registered_event_ids'); } catch {}
      return [];
    }
    try {
      const list = await studentApi.getRegistrations();
      if (Array.isArray(list)) {
        const ids = list
          .map(r => r.eventId || r.event?.id || r.id)
          .filter(Boolean)
          .map(id => Number(id));
        const unique = Array.from(new Set(ids));
        setRegisteredEventIds(unique);
        try { localStorage.setItem('avento_registered_event_ids', JSON.stringify(unique)); } catch {}
        return unique;
      }
    } catch {
      // Keep existing cached state if request fails
    }
    return [];
  }, []);

  const isEventRegistered = useCallback((eventId) => {
    if (!eventId) return false;
    const numericId = Number(eventId);
    return registeredEventIds.includes(numericId) || registeredEventIds.includes(String(eventId));
  }, [registeredEventIds]);

  const addRegisteredEventId = useCallback((eventId) => {
    if (!eventId) return;
    const numericId = Number(eventId);
    setRegisteredEventIds(prev => {
      const next = Array.from(new Set([...prev, numericId]));
      try { localStorage.setItem('avento_registered_event_ids', JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  useEffect(() => {
    if (user?.email) {
      refreshUserRegistrations();
    } else {
      setRegisteredEventIds([]);
      try { localStorage.removeItem('avento_registered_event_ids'); } catch {}
    }
  }, [user?.email, refreshUserRegistrations]);

  // Helper to fetch or create user document in Firestore
  const syncFirestoreUser = useCallback(async (fbUser, overrides = {}) => {
    if (!fbUser) return null;
    const resolvedName = overrides.fullName || overrides.name || fbUser.displayName || fbUser.email?.split('@')[0] || 'AVENTO User';
    if (!isFirebaseConfigured) {
      return {
        uid: fbUser.uid,
        email: fbUser.email,
        fullName: resolvedName,
        name: resolvedName,
        role: overrides.role || 'STUDENT',
        approved: overrides.approved !== undefined ? overrides.approved : (overrides.role !== 'ORGANIZER'),
        blocked: overrides.blocked || false,
        phoneNumber: overrides.phoneNumber || '',
        college: overrides.college || '',
        branch: overrides.branch || '',
        year: overrides.year || '',
        ...overrides
      };
    }
    try {
      const userRef = doc(db, 'users', fbUser.uid);
      const userSnap = await getDoc(userRef);

      let data;
      if (userSnap.exists()) {
        data = userSnap.data();
        if (Object.keys(overrides).length > 0) {
          data = { ...data, ...overrides };
          await setDoc(userRef, overrides, { merge: true });
        }
      } else {
        data = {
          uid: fbUser.uid,
          email: fbUser.email,
          name: overrides.name || fbUser.displayName || fbUser.email?.split('@')[0] || 'AVENTO User',
          role: overrides.role || 'STUDENT',
          approved: overrides.approved !== undefined ? overrides.approved : (overrides.role !== 'ORGANIZER'),
          blocked: overrides.blocked || false,
          phoneNumber: overrides.phoneNumber || '',
          college: overrides.college || '',
          branch: overrides.branch || '',
          year: overrides.year || '',
          createdAt: serverTimestamp(),
          ...overrides
        };
        await setDoc(userRef, data, { merge: true });
      }

      // Sync with Spring Boot MySQL backend
      try {
        const backendUser = await authApi.sync({
          firebaseUid: fbUser.uid,
          email: fbUser.email,
          fullName: data.name || fbUser.displayName,
          phoneNumber: data.phoneNumber,
          role: data.role,
          approved: data.approved,
          blocked: data.blocked,
          college: data.college,
          branch: data.branch,
          year: data.year
        });
        if (backendUser) {
          data = { ...data, ...backendUser, uid: fbUser.uid };
        }
      } catch (beErr) {
        console.warn('Backend sync warning:', beErr?.message);
      }

      return data;
    } catch (err) {
      console.warn('Firestore synchronization error:', err);
      // Fallback local representation
      return {
        uid: fbUser.uid,
        email: fbUser.email,
        name: overrides.name || fbUser.displayName || fbUser.email?.split('@')[0] || 'AVENTO User',
        role: overrides.role || 'STUDENT',
        approved: overrides.approved !== undefined ? overrides.approved : (overrides.role !== 'ORGANIZER'),
        blocked: overrides.blocked || false,
        ...overrides
      };
    }
  }, []);

  // Subscribe to Firebase Auth state & manage session lifecycle
  useEffect(() => {
    // If session has already expired according to TTL, clean up immediately
    if (authStorage.isSessionExpired()) {
      authStorage.clear();
      setUser(null);
      setToken(null);
      setLoading(false);
      return;
    }

    // When Firebase credentials are not yet configured, bypass Google Identity Toolkit network calls
    if (!isFirebaseConfigured) {
      const storedUser = authStorage.getUser();
      const storedToken = authStorage.getToken();
      if (storedUser && storedToken) {
        setUser(storedUser);
        setToken(storedToken);
      }
      setLoading(false);

      const handleUnauthorized = () => {
        authStorage.clear();
        setUser(null);
        setToken(null);
      };

      const handleSessionExpired = () => {
        authStorage.clear();
        setUser(null);
        setToken(null);
      };

      window.addEventListener('avento_auth_unauthorized', handleUnauthorized);
      window.addEventListener('avento_session_expired', handleSessionExpired);
      return () => {
        window.removeEventListener('avento_auth_unauthorized', handleUnauthorized);
        window.removeEventListener('avento_session_expired', handleSessionExpired);
      };
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setLoading(true);
      if (fbUser) {
        try {
          const idToken = await fbUser.getIdToken();
          authStorage.setToken(idToken);
          setToken(idToken);

          const profile = await syncFirestoreUser(fbUser);
          const isRemember = localStorage.getItem('avento_remember_me') !== 'false';
          authStorage.setUser(profile, isRemember);
          setUser(profile);
        } catch (error) {
          console.error('Error handling auth state change:', error);
          if (authStorage.isSessionExpired()) {
            authStorage.clear();
            setUser(null);
            setToken(null);
          }
        }
      } else {
        if (authStorage.isSessionExpired()) {
          authStorage.clear();
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    });

    const handleUnauthorized = () => {
      signOut(auth).catch(() => {});
      authStorage.clear();
      setUser(null);
      setToken(null);
    };

    const handleSessionExpired = () => {
      signOut(auth).catch(() => {});
      authStorage.clear();
      setUser(null);
      setToken(null);
    };

    window.addEventListener('avento_auth_unauthorized', handleUnauthorized);
    window.addEventListener('avento_session_expired', handleSessionExpired);
    return () => {
      unsubscribe();
      window.removeEventListener('avento_auth_unauthorized', handleUnauthorized);
      window.removeEventListener('avento_session_expired', handleSessionExpired);
    };
  }, [syncFirestoreUser]);

  // Periodic background check to guarantee session automatically expires when TTL passes
  useEffect(() => {
    const checkSessionValidity = () => {
      if (authStorage.isSessionExpired()) {
        authStorage.clear();
        setUser(null);
        setToken(null);
        window.dispatchEvent(new CustomEvent('avento_session_expired'));
      }
    };

    const interval = setInterval(checkSessionValidity, 30000);
    window.addEventListener('focus', checkSessionValidity);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', checkSessionValidity);
    };
  }, []);

  // Login with Email and Password
  const login = useCallback(async (email, password, remember = true, preferredRole = 'STUDENT') => {
    setLoading(true);
    try {
      const trimmedEmail = email ? email.trim() : '';
      if (!trimmedEmail || !password) {
        throw new Error('Please enter both email and password.');
      }

      if (!isFirebaseConfigured) {
        // Authenticate against MySQL Database via authApi.login
        try {
          const dbUser = await authApi.login({
            email: trimmedEmail,
            password: password
          });

          if (dbUser) {
            const role = dbUser.role || preferredRole;
            const uid = dbUser.firebaseUid || ('avento_db_' + dbUser.id);
            const sessionToken = 'avento_session_' + Date.now() + '_' + dbUser.id;

            const resolvedName = dbUser.fullName || dbUser.name || trimmedEmail.split('@')[0];
            const profile = {
              uid: uid,
              id: dbUser.id,
              email: dbUser.email,
              fullName: resolvedName,
              name: resolvedName,
              role: role,
              approved: dbUser.approved !== false,
              blocked: Boolean(dbUser.blocked),
              phoneNumber: dbUser.phoneNumber || '',
              college: dbUser.college || '',
              branch: dbUser.branch || '',
              year: dbUser.year || ''
            };

            authStorage.setToken(sessionToken);
            authStorage.setUser(profile, remember);
            setUser(profile);
            setToken(sessionToken);

            return { user: profile, token: sessionToken };
          }
        } catch (dbErr) {
          const errMsg = dbErr.response?.data?.message || dbErr.message || 'Invalid email or password.';
          throw new Error(errMsg);
        }

        throw new Error(`User with email "${trimmedEmail}" does not exist in database. Please sign up first.`);
      }

      await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
      const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, password);
      const fbUser = userCredential.user;
      const idToken = await fbUser.getIdToken();
      authStorage.setToken(idToken);
      setToken(idToken);

      const profile = await syncFirestoreUser(fbUser);
      authStorage.setUser(profile, remember);
      setUser(profile);

      return { user: profile, token: idToken };
    } finally {
      setLoading(false);
    }
  }, [syncFirestoreUser]);

  // Signup with Email and Password
  const signup = useCallback(async (userData) => {
    setLoading(true);
    try {
      const { email, password, fullName, phoneNumber, role, college, branch, year } = userData;
      const trimmedEmail = email ? email.trim() : '';
      if (!trimmedEmail || !password) {
        throw new Error('Please fill in all required fields.');
      }
      const isOrganizer = role === 'ORGANIZER';

      if (!isFirebaseConfigured) {
        // Persist new User directly into MySQL Database with encrypted password
        let backendUser;
        try {
          backendUser = await authApi.sync({
            email: trimmedEmail,
            password: password,
            fullName: fullName?.trim() || trimmedEmail.split('@')[0],
            phoneNumber: phoneNumber?.trim() || '',
            role: role || 'STUDENT',
            approved: !isOrganizer,
            blocked: false,
            college: college || '',
            branch: branch || '',
            year: year || ''
          });
        } catch (syncErr) {
          const errMsg = syncErr.response?.data?.message || syncErr.message || 'Registration failed in database.';
          throw new Error(errMsg);
        }

        if (!backendUser) {
          throw new Error('Failed to create account in database. Please try again.');
        }

        const uid = backendUser.firebaseUid || ('avento_db_' + backendUser.id);
        const sessionToken = 'avento_session_' + Date.now() + '_' + backendUser.id;
        const resolvedName = backendUser.fullName || fullName?.trim() || trimmedEmail.split('@')[0];

        const profile = {
          uid: uid,
          id: backendUser.id,
          email: backendUser.email,
          fullName: resolvedName,
          name: resolvedName,
          role: backendUser.role || role || 'STUDENT',
          approved: backendUser.approved !== false,
          blocked: Boolean(backendUser.blocked),
          phoneNumber: backendUser.phoneNumber || phoneNumber?.trim() || '',
          college: backendUser.college || college || '',
          branch: backendUser.branch || branch || '',
          year: backendUser.year || year || ''
        };

        authStorage.setToken(sessionToken);
        authStorage.setUser(profile, true);
        setUser(profile);
        setToken(sessionToken);

        return { user: profile, token: sessionToken };
      }

      const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
      const fbUser = userCredential.user;

      if (fullName) {
        await updateProfile(fbUser, { displayName: fullName.trim() }).catch(() => {});
      }

      // Send Firebase Email Verification
      await sendEmailVerification(fbUser).catch((e) => {
        console.warn('Verification email dispatch note:', e.message);
      });

      const overrides = {
        fullName: fullName?.trim() || '',
        name: fullName?.trim() || '',
        phoneNumber: phoneNumber?.trim() || '',
        role: role || 'STUDENT',
        approved: !isOrganizer,
        blocked: false,
        college: college || '',
        branch: branch || '',
        year: year || ''
      };

      const idToken = await fbUser.getIdToken();
      authStorage.setToken(idToken);
      setToken(idToken);

      const profile = await syncFirestoreUser(fbUser, overrides);
      authStorage.setUser(profile, true);
      setUser(profile);

      return { user: profile, token: idToken };
    } finally {
      setLoading(false);
    }
  }, [syncFirestoreUser]);

  // Google Sign In
  const loginWithGoogle = useCallback(async () => {
    setLoading(true);
    try {
      const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

      // 1. Direct Google OAuth 2.0 via Google Identity Services
      if (googleClientId && !googleClientId.includes('your_google_client_id')) {
        const { accessToken, userInfo } = await promptGoogleSignIn(googleClientId);
        const googleUid = 'google_' + userInfo.id;

        // Persist user to MySQL database
        let backendUser = null;
        try {
          backendUser = await authApi.sync({
            firebaseUid: googleUid,
            email: userInfo.email,
            fullName: userInfo.name,
            role: 'STUDENT',
            approved: true,
            blocked: false
          });
        } catch (syncErr) {
          const errMsg = syncErr.response?.data?.message || syncErr.message;
          console.warn('Database sync response:', errMsg);
        }

        const resolvedName = userInfo.name || backendUser?.fullName || userInfo.email?.split('@')[0];
        const profile = {
          uid: googleUid,
          id: backendUser?.id,
          email: userInfo.email,
          fullName: resolvedName,
          name: resolvedName,
          role: backendUser?.role || 'STUDENT',
          approved: backendUser?.approved !== false,
          blocked: Boolean(backendUser?.blocked),
          phoneNumber: backendUser?.phoneNumber || '',
          college: backendUser?.college || '',
          branch: backendUser?.branch || '',
          year: backendUser?.year || '',
          avatar: userInfo.picture
        };

        authStorage.setToken(accessToken);
        authStorage.setUser(profile, true);
        setUser(profile);
        setToken(accessToken);

        return { user: profile, token: accessToken };
      }

      // 2. Firebase Google Authentication (if Firebase credentials configured)
      if (isFirebaseConfigured) {
        await setPersistence(auth, browserLocalPersistence);
        const userCredential = await signInWithPopup(auth, googleProvider);
        const fbUser = userCredential.user;
        const idToken = await fbUser.getIdToken();
        authStorage.setToken(idToken);
        setToken(idToken);

        const profile = await syncFirestoreUser(fbUser);
        authStorage.setUser(profile, true);
        setUser(profile);

        return { user: profile, token: idToken };
      }

      throw new Error('Google Sign-In is not configured. Please verify your Google Client ID.');
    } finally {
      setLoading(false);
    }
  }, [syncFirestoreUser]);

  // Forgot Password
  const forgotPassword = useCallback(async (email) => {
    setLoading(true);
    try {
      if (!isFirebaseConfigured) {
        return { success: true, message: 'Password reset link sent (dev mode)' };
      }
      await sendPasswordResetEmail(auth, email.trim());
      return { success: true, message: 'Password reset link dispatched to your email' };
    } finally {
      setLoading(false);
    }
  }, []);

  // Send Email Verification
  const sendVerification = useCallback(async () => {
    if (!isFirebaseConfigured) {
      return { success: true, message: 'Email verification sent (dev mode)' };
    }
    if (auth.currentUser) {
      return await sendEmailVerification(auth.currentUser);
    }
    throw new Error('No active user logged in');
  }, []);

  // Logout
  const logout = useCallback(async () => {
    if (isFirebaseConfigured) {
      try {
        await signOut(auth);
      } catch (e) {
        console.warn('Firebase signOut error:', e);
      }
    }
    authStorage.clear();
    try { localStorage.removeItem('avento_registered_event_ids'); } catch {}
    setRegisteredEventIds([]);
    setUser(null);
    setToken(null);
  }, []);

  const updateUser = useCallback((updatedUserData) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedUserData };
      const isRemember = localStorage.getItem('avento_remember_me') !== 'false';
      authStorage.setUser(updated, isRemember);
      return updated;
    });
  }, []);

  const value = {
    user,
    token,
    role: user?.role || null,
    isAuthenticated: !!token && !!user,
    loading,
    login,
    signup,
    loginWithGoogle,
    forgotPassword,
    sendVerification,
    logout,
    updateUser,
    registeredEventIds,
    isEventRegistered,
    addRegisteredEventId,
    refreshUserRegistrations
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
