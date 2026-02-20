import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace the placeholder config below with your real Firebase project config.
// You can get this from the Firebase Console:
// Project settings ➜ General ➜ Your apps ➜ SDK setup and configuration.
const firebaseConfig = {

  apiKey: "AIzaSyBANEXRJBNJ2r4KYD6wzlBzO6l2iqNpkpo",
  authDomain: "slot-booking-66fe4.firebaseapp.com",
  projectId: "slot-booking-66fe4",
  storageBucket: "slot-booking-66fe4.firebasestorage.app",
  messagingSenderId: "45226791584",
  appId: "1:45226791584:web:e9f668cb64072e3169afc5",
  measurementId: "G-PX90GJ4Y25"
  

};

console.log('[Firebase] Initializing app with config:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
});

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;

