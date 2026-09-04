import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  setPersistence, 
  browserLocalPersistence, 
  browserSessionPersistence 
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Validate whether real Firebase credentials are provided in environment
export const isFirebaseConfigured = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY &&
  !import.meta.env.VITE_FIREBASE_API_KEY.includes('MockKey') &&
  import.meta.env.VITE_FIREBASE_API_KEY !== 'your_firebase_api_key' &&
  import.meta.env.VITE_FIREBASE_API_KEY.trim().length > 10
);

// Firebase configuration from Vite environment variables or safe dev placeholders
const firebaseConfig = {
  apiKey: isFirebaseConfigured ? import.meta.env.VITE_FIREBASE_API_KEY : 'avento-dev-mode-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'avento-project.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'avento-project',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'avento-project.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '100000000000',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:100000000000:web:mockappid0000000000'
};

// Initialize Firebase App as Singleton
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Firestore Database
export const db = getFirestore(app);

export { 
  setPersistence, 
  browserLocalPersistence, 
  browserSessionPersistence 
};

export default app;
