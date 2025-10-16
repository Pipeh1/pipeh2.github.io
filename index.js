import { db } from "./Firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const contenedor = document.getElementById("productos-lista");

async function cargarProductos() {
  try {
    const snapshot = await getDocs(collection(db, "listings"));
    contenedor.innerHTML = "";

    if (snapshot.empty) {
      contenedor.innerHTML = "<p>No hay productos publicados aún.</p>";
      return;
    }

    snapshot.forEach((doc) => {
      const item = doc.data();
      contenedor.innerHTML += cardHtml(item);
    });
  } catch (error) {
    console.error("Error al cargar productos:", error);
    contenedor.innerHTML = "<p>Error al cargar productos.</p>";
  }
}

function cardHtml(item) {
  const tipoTexto =
    item.rentalType === "dia"
      ? "día"
      : item.rentalType === "semana"
      ? "semana"
      : "mes";

  return `
    <div class="carta">
      <img src="${item.imageUrl}" alt="${item.title}"
           style="width:100%;height:180px;object-fit:cover;border-radius:12px;margin-bottom:12px">

      <h3>${item.title}</h3>
      <p>${item.location || ""}</p>
      <p><strong>$${(item.price || 0).toLocaleString("es-CO")} COP / ${tipoTexto}</strong></p>
      <a href="#" class="btn-alquilar">ALQUILA YA</a>
    </div>
  `;
}

cargarProductos();

const toggleTema = document.getElementById("toggle-tema");

const temaGuardado = localStorage.getItem("tema");
if (temaGuardado === "oscuro") {
  document.body.classList.add("modo-oscuro");
  if (toggleTema) toggleTema.textContent = "☀️ Modo claro";
}

if (toggleTema) {
  toggleTema.addEventListener("click", () => {
    const modoOscuro = document.body.classList.toggle("modo-oscuro");
    localStorage.setItem("tema", modoOscuro ? "oscuro" : "claro");
    toggleTema.textContent = modoOscuro ? "☀️ Modo claro" : "🌙 Modo oscuro";
  });
}
