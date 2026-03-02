import { initializeApp } from "firebase/app";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  getDoc,
  where,
} from "firebase/firestore";

import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInAnonymously,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAyuETLGIpRif60ncih2LydFRbGhCdZU0A",
  // authDomain is typically `${projectId}.firebaseapp.com`. The previous value had a space and caused Auth failures.
  authDomain: "calendar-demo-df7e6.firebaseapp.com",
  projectId: "calendar-demo-df7e6",
  storageBucket: "calendar-demo-df7e6.firebasestorage.app",
  messagingSenderId: "617344029042",
  appId: "1:617344029042:web:631fb53c6cbbb81cab4deb",
  measurementId: "G-H1HH93RXWX",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);

export const provider = new GoogleAuthProvider();

// If your Firestore rules require `request.auth != null`, we need a Firebase Auth user.
// This signs in anonymously once (if enabled in Firebase Console). If disabled, we warn once and continue.
let __triedAnonymous = false;
onAuthStateChanged(auth, async (user) => {
  if (user || __triedAnonymous) return;
  __triedAnonymous = true;
  try {
    await signInAnonymously(auth);
  } catch (error) {
    const code = error?.code || "";
    // Common when Anonymous provider is disabled: auth/admin-restricted-operation or auth/operation-not-allowed
    console.warn(
      "[firebase] Anonymous auth failed. If Firestore rules require auth, enable Anonymous sign-in in Firebase Console → Authentication → Sign-in method.",
      code,
    );
  }
});

export {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  getDoc,
  where,
};
