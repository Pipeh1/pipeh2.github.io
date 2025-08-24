import { db, collection, getDocs, query, orderBy } from "./Firebase.js";

const productosLista = document.getElementById("productos-lista");

async function cargarProductos() {
  try {
    const q = query(collection(db, "productos"), orderBy("creado", "desc"));
    const snap = await getDocs(q);

    productosLista.innerHTML = "";

    snap.forEach((doc) => {
      const data = doc.data();
      productosLista.innerHTML += `
        <div class="producto-item" onclick="location.href='producto.html?id=${doc.id}'">
          <img class="producto-img" src="${data.foto}" alt="${data.titulo}">
          <div class="producto-detalles">
            <h2 class="producto-nombre">${data.titulo}</h2>
            <p class="producto-precio">$${data.precio} COP / ${data.tipo}</p>
            <p class="producto-ubicacion">📍 ${data.ubicacion}</p>
            <p class="producto-descripcion">${data.descripcion.substring(0, 80)}...</p>
          </div>
        </div>
      `;
    });

  } catch (err) {
    console.error("❌ Error cargando productos:", err);
  }
}

cargarProductos();
