// Import the functions you need from the SDKs you need
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
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAyuETLGIpRif60ncih2LydFRbGhCdZU0A",
  authDomain: "chat mode-df7e6.firebaseapp.com",
  projectId: "calendar-demo-df7e6",
  storageBucket: "calendar-demo-df7e6.firebasestorage.app",
  messagingSenderId: "617344029042",
  appId: "1:617344029042:web:631fb53c6cbbb81cab4deb",
  measurementId: "G-H1HH93RXWX",
  // apiKey: "AIzaSyAw8E4ohKviPPkEIaSJwwIDN16DLPWyBJA",
  // authDomain: "virajkadambookslot.firebaseapp.com",
  // projectId: "virajkadambookslot",
  // storageBucket: "virajkadambookslot.firebasestorage.app",
  // messagingSenderId: "615894090896",
  // appId: "1:615894090896:web:be88d5b517c352575fc415",
  // measurementId: "G-7NEYNNR4S7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

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
