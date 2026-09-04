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
import { authApi, authStorage } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authStorage.getUser());
  const [token, setToken] = useState(() => authStorage.getToken());
  const [loading, setLoading] = useState(true);

  // Helper to fetch or create user document in Firestore
  const syncFirestoreUser = useCallback(async (fbUser, overrides = {}) => {
    if (!fbUser) return null;
    if (!isFirebaseConfigured) {
      return {
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

  // Subscribe to Firebase Auth state
  useEffect(() => {
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

      window.addEventListener('avento_auth_unauthorized', handleUnauthorized);
      return () => {
        window.removeEventListener('avento_auth_unauthorized', handleUnauthorized);
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
          authStorage.setUser(profile);
          setUser(profile);
        } catch (error) {
          console.error('Error handling auth state change:', error);
          authStorage.clear();
          setUser(null);
          setToken(null);
        }
      } else {
        authStorage.clear();
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    });

    const handleUnauthorized = () => {
      signOut(auth).catch(() => {});
      authStorage.clear();
      setUser(null);
      setToken(null);
    };

    window.addEventListener('avento_auth_unauthorized', handleUnauthorized);
    return () => {
      unsubscribe();
      window.removeEventListener('avento_auth_unauthorized', handleUnauthorized);
    };
  }, [syncFirestoreUser]);

  // Login with Email and Password
  const login = useCallback(async (email, password, remember = true, preferredRole = 'STUDENT') => {
    setLoading(true);
    try {
      if (!isFirebaseConfigured) {
        const trimmedEmail = email.trim();
        const existingStored = authStorage.getUser();
        const role = (existingStored && existingStored.email?.toLowerCase() === trimmedEmail.toLowerCase())
          ? (existingStored.role || preferredRole)
          : preferredRole;
        const isOrganizer = role === 'ORGANIZER';
        const displayName = (existingStored && existingStored.email?.toLowerCase() === trimmedEmail.toLowerCase() && existingStored.name)
          ? existingStored.name
          : trimmedEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

        const mockUid = 'avento_dev_' + Math.abs(trimmedEmail.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)).toString(36);
        const mockToken = 'mock_fb_token_' + Date.now();

        let profile = {
          uid: mockUid,
          email: trimmedEmail,
          name: displayName || 'AVENTO User',
          role: role,
          approved: !isOrganizer,
          blocked: false,
          phoneNumber: existingStored?.phoneNumber || '',
          college: existingStored?.college || '',
          branch: existingStored?.branch || '',
          year: existingStored?.year || ''
        };

        // Sync with Spring Boot backend if running
        try {
          const backendUser = await authApi.sync({
            firebaseUid: mockUid,
            email: trimmedEmail,
            fullName: profile.name,
            phoneNumber: profile.phoneNumber,
            role: profile.role,
            approved: profile.approved,
            blocked: profile.blocked,
            college: profile.college,
            branch: profile.branch,
            year: profile.year
          });
          if (backendUser) {
            profile = { ...profile, ...backendUser, uid: mockUid };
          }
        } catch (syncErr) {
          console.warn('Backend sync note (dev mode):', syncErr.message);
        }

        authStorage.setToken(mockToken);
        authStorage.setUser(profile);
        setUser(profile);
        setToken(mockToken);

        return { user: profile, token: mockToken };
      }

      await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const fbUser = userCredential.user;
      const idToken = await fbUser.getIdToken();
      authStorage.setToken(idToken);
      setToken(idToken);

      const profile = await syncFirestoreUser(fbUser);
      authStorage.setUser(profile);
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
      const trimmedEmail = email.trim();
      const isOrganizer = role === 'ORGANIZER';

      if (!isFirebaseConfigured) {
        const mockUid = 'avento_dev_' + Math.abs(trimmedEmail.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)).toString(36);
        const mockToken = 'mock_fb_token_' + Date.now();

        let profile = {
          uid: mockUid,
          email: trimmedEmail,
          name: fullName?.trim() || trimmedEmail.split('@')[0],
          role: role || 'STUDENT',
          approved: !isOrganizer,
          blocked: false,
          phoneNumber: phoneNumber?.trim() || '',
          college: college || '',
          branch: branch || '',
          year: year || ''
        };

        try {
          const backendUser = await authApi.sync({
            firebaseUid: mockUid,
            email: trimmedEmail,
            fullName: profile.name,
            phoneNumber: profile.phoneNumber,
            role: profile.role,
            approved: profile.approved,
            blocked: profile.blocked,
            college: profile.college,
            branch: profile.branch,
            year: profile.year
          });
          if (backendUser) {
            profile = { ...profile, ...backendUser, uid: mockUid };
          }
        } catch (syncErr) {
          console.warn('Backend sync note (dev mode):', syncErr.message);
        }

        authStorage.setToken(mockToken);
        authStorage.setUser(profile);
        setUser(profile);
        setToken(mockToken);

        return { user: profile, token: mockToken };
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
      authStorage.setUser(profile);
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
      if (!isFirebaseConfigured) {
        const mockUid = 'avento_google_' + Date.now().toString(36);
        const mockToken = 'mock_google_token_' + Date.now();
        let profile = {
          uid: mockUid,
          email: 'alex.morgan@campus.edu',
          name: 'Alex Morgan',
          role: 'STUDENT',
          approved: true,
          blocked: false,
          phoneNumber: '+91 98765 43210',
          college: 'Campus Tech Institute',
          branch: 'Computer Science',
          year: '3rd Year'
        };

        try {
          const backendUser = await authApi.sync({
            firebaseUid: mockUid,
            email: profile.email,
            fullName: profile.name,
            phoneNumber: profile.phoneNumber,
            role: profile.role,
            approved: profile.approved,
            blocked: profile.blocked,
            college: profile.college,
            branch: profile.branch,
            year: profile.year
          });
          if (backendUser) {
            profile = { ...profile, ...backendUser, uid: mockUid };
          }
        } catch (syncErr) {
          console.warn('Backend sync note (dev mode):', syncErr.message);
        }

        authStorage.setToken(mockToken);
        authStorage.setUser(profile);
        setUser(profile);
        setToken(mockToken);

        return { user: profile, token: mockToken };
      }

      await setPersistence(auth, browserLocalPersistence);
      const userCredential = await signInWithPopup(auth, googleProvider);
      const fbUser = userCredential.user;
      const idToken = await fbUser.getIdToken();
      authStorage.setToken(idToken);
      setToken(idToken);

      const profile = await syncFirestoreUser(fbUser);
      authStorage.setUser(profile);
      setUser(profile);

      return { user: profile, token: idToken };
    } finally {
      setLoading(false);
    }
  }, [syncFirestoreUser]);

  // Forgot Password
  const forgotPassword = useCallback(async (email) => {
    if (!isFirebaseConfigured) {
      return { success: true, message: 'Password reset link sent (dev mode).' };
    }
    return await sendPasswordResetEmail(auth, email.trim());
  }, []);

  // Send Email Verification
  const sendVerification = useCallback(async () => {
    if (!isFirebaseConfigured) {
      return { success: true, message: 'Email verification dispatched (dev mode).' };
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
    setUser(null);
    setToken(null);
  }, []);

  const updateUser = useCallback((updatedUserData) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedUserData };
      authStorage.setUser(updated);
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
    updateUser
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
