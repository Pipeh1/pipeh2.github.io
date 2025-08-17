import { signOut, auth } from './Firebase.js';

export function configurarCerrarSesion() {
  const btn = document.getElementById("cerrar-sesion-btn");
  if (btn && !btn.dataset.listenerAgregado) {
    btn.dataset.listenerAgregado = "true"; 
    btn.addEventListener("click", async () => {
      try {
        await signOut(auth);
        window.location.href = "login.html";
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
        alert("Error al cerrar sesión: " + error.message);
      }
    });
  }
}
