import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyC1illG7VbYLvW81Y-IMwT__67G7bdKeHE",
  authDomain: "Rentaplus-5fe77.firebaseapp.com",
  projectId: "Rentaplus-5fe77",
  storageBucket: "Rentaplus-5fe77.appspot.com",
  messagingSenderId: "373936369407",
  appId: "1:373936369407:web:44593a6343a5d8853ca6ca",
  measurementId: "G-PBGK43T70T"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
};