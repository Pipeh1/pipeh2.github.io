import { db, collection, getDocs } from "./Firebase.js";

const productosLista = document.getElementById("productos-lista");

async function cargarProductos() {
  try {
    const querySnapshot = await getDocs(collection(db, "productos"));
    productosLista.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const data = doc.data();

      productosLista.innerHTML += `
        <div class="producto-item" onclick="location.href='producto.html?id=${doc.id}'">
          <div class="producto-img">
            <img src="${data.foto}" alt="${data.titulo}">
          </div>
          <div class="producto-info">
            <h3>${data.titulo}</h3>
            <p class="producto-precio">$${Number(data.precio).toLocaleString("es-CO")} COP</p>
            <p class="producto-extra">3 cuotas sin interés</p>
            <p class="producto-envio">Llega gratis mañana</p>
          </div>
        </div>
      `;
    });
  } catch (err) {
    console.error("❌ Error cargando productos:", err);
  }
}

cargarProductos();
