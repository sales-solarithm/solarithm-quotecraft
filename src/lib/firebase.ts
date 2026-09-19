import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const getEnv = (key: string, fallback: string) => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return fallback;
};

const firebaseConfig = {
  apiKey: getEnv('VITE_FIREBASE_API_KEY', "AIzaSyBH2Lz_nj-9GcHDM-xm7704Y-B2Po6ysZs"),
  authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN', "solarithm-apps.firebaseapp.com"),
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID', "solarithm-apps"),
  storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET', "solarithm-apps.firebasestorage.app"),
  messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID', "1038076253708"),
  appId: getEnv('VITE_FIREBASE_APP_ID', "1:1038076253708:web:6a08918b292e3d3b530029")
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.error("Failed to set persistence:", error);
  });
}

export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
