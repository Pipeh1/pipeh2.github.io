import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC1illG7VbYLvW81Y-IMwT__67G7bdKeHE",
  authDomain: "rentaplus-5fe77.firebaseapp.com",   // 👈 minúsculas
  projectId: "rentaplus-5fe77",                     // 👈 minúsculas
  storageBucket: "rentaplus-5fe77.appspot.com",     // 👈 minúsculas
  messagingSenderId: "373936369407",
  appId: "1:373936369407:web:44593a6343a5d8853ca6ca",
  measurementId: "G-PBGK43T70T"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app, "gs://rentaplus-5fe77.firebasestorage.app"); 
const db = getFirestore(app);

const contenedorUsuario = document.getElementById("usuario-menu");
const nombreElemento = document.getElementById("usuario-nombre");
const usuarioFoto = document.getElementById("usuario-foto");
const linkSesion = document.getElementById("link-sesion");
const cerrarSesionBtn = document.getElementById("cerrar-sesion-btn");

onAuthStateChanged(auth, (user) => {
  if (user) {
    if (contenedorUsuario) contenedorUsuario.style.display = "inline-block";
    if (nombreElemento) nombreElemento.textContent = user.displayName || user.email;
    if (usuarioFoto) usuarioFoto.src = user.photoURL || "img/default.png";
    if (linkSesion) linkSesion.style.display = "none";
  } else {
    if (contenedorUsuario) contenedorUsuario.style.display = "none";
    if (linkSesion) {
      linkSesion.style.display = "inline-block";
      linkSesion.textContent = "Iniciar sesión";
      linkSesion.href = "login.html";
    }
  }
});

if (cerrarSesionBtn) {
  cerrarSesionBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
      window.location.href = "login.html";
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
      alert("Error al cerrar sesión: " + err.message);
    }
  });
}

export {
  auth,
  storage,
  db,
  ref,
  uploadBytes,
  getDownloadURL,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  serverTimestamp
};
