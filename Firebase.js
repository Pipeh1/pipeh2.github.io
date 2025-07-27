import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  OAuthProvider,
  signInWithPopup,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyC1illG7VbYLvW81Y-IMwT__67G7bdKeHE",
  authDomain: "Rentaplus-5fe77.firebaseapp.com",
  projectId: "Rentaplus.5fe77",
    storageBucket: "Rentaplus-5fe77.firebasestorage.com",
    messagingSenderId: "373936369407",
  appId: "1:373936369407:web:44593a6343a5d8853ca6ca",
    measurementId: "G-PBGK43T70T"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


window.auth = auth;
window.createUserWithEmailAndPassword = createUserWithEmailAndPassword;
window.signInWithEmailAndPassword = signInWithEmailAndPassword;
window.signOut = signOut;
window.onAuthStateChanged = onAuthStateChanged;
window.updateProfile = updateProfile;

window.OAuthProvider = OAuthProvider;
window.signInWithPopup = signInWithPopup;

const saludo = document.getElementById("bienvenida");
onAuthStateChanged(auth, user => {
  if (user && user.displayName) {
    saludo.textContent = `Hola, ${user.displayName}`;
    saludo.style.display = "block";
  } else {
    saludo.style.display = "none";
  }
});