import { db, collection, getDocs } from "./Firebase.js";

const productosLista = document.getElementById("productos-lista");

async function cargarProductos() {
  try {
    const querySnapshot = await getDocs(collection(db, "productos"));

    if (querySnapshot.empty) {
      productosLista.innerHTML = "<p>⚠️ No hay productos publicados.</p>";
      return;
    }

    productosLista.innerHTML = ""; 

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log("📸 URL de la imagen:", data.foto); 

      productosLista.innerHTML += `
        <div class="productos-card">
          <img src="${data.foto}" alt="${data.titulo}" />
          <h3>${data.titulo}</h3>
          <p>${data.precio} COP / ${data.tipo}</p>
          <button onclick="location.href='producto.html?id=${doc.id}'">Ver más</button>
        </div>
      `;
    });
  } catch (err) {
    console.error("❌ Error cargando productos:", err);
    productosLista.innerHTML = "<p>⚠️ Error cargando productos.</p>";
  }
}

cargarProductos();
