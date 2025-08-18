import { db } from "./Firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const lista = document.getElementById("productos-lista");

async function cargarProductos() {
  try {
    console.log("📡 Consultando productos en Firestore...");
    const querySnapshot = await getDocs(collection(db, "productos"));

    if (querySnapshot.empty) {
      console.log("⚠️ No hay productos publicados.");
      lista.innerHTML = "<p>No hay productos publicados aún.</p>";
      return;
    }

    lista.innerHTML = ""; 
    querySnapshot.forEach((doc) => {
      const producto = doc.data();
      console.log("✅ Producto encontrado:", producto);

      const card = document.createElement("div");
      card.className = "productos-card";

      card.innerHTML = `
        <img src="${producto.fotoURL}" alt="${producto.titulo}">
        <h3>${producto.titulo}</h3>
        <p>${producto.descripcion}</p>
        <p><strong>Ubicación:</strong> ${producto.ubicacion}</p>
        <p><strong>Precio:</strong> $${producto.precio} COP (${producto.tipo})</p>
        <button class="btn-alquilar">Alquilar</button>
      `;
      lista.appendChild(card);
    });
  } catch (err) {
    console.error("❌ Error al cargar productos:", err);
    lista.innerHTML = "<p>Error al cargar productos.</p>";
  }
}

cargarProductos();
