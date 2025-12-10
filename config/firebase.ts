import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, OAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAlZRrw-QsoC1VV24cVPmO3nHgPopfP7SE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "zemenai-dev.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "zemenai-dev",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "zemenai-dev.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "868207443876",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:868207443876:web:c89cd4f1d7451fa5640b31",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-DEBHXRBF2M"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export const facebookProvider = new FacebookAuthProvider();

export const appleProvider = new OAuthProvider('apple.com');
appleProvider.addScope('email');
appleProvider.addScope('name');

export default app;
