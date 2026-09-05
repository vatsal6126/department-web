import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const requiredConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Object.values(requiredConfig).every(Boolean);

if (!isFirebaseConfigured) {
  console.warn('Firebase is not configured. Add the required VITE_FIREBASE_* values to .env.local.');
}

const app = initializeApp({
  apiKey: requiredConfig.apiKey || 'not-configured',
  authDomain: requiredConfig.authDomain || 'not-configured',
  projectId: requiredConfig.projectId || 'not-configured',
  storageBucket: requiredConfig.storageBucket || 'not-configured',
  messagingSenderId: requiredConfig.messagingSenderId || 'not-configured',
  appId: requiredConfig.appId || 'not-configured',
});

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
