import { db, collection, getDocs } from "./Firebase.js";

const productosLista = document.getElementById("productos-lista");
const filtroTipo = document.getElementById("filtro-tipo");

async function cargarProductos() {
  try {
    productosLista.innerHTML = "<p>Cargando productos...</p>";
    const querySnapshot = await getDocs(collection(db, "productos"));

    if (querySnapshot.empty) {
      productosLista.innerHTML = "<p>⚠️ No hay productos publicados.</p>";
      return;
    }

    let productos = [];
    querySnapshot.forEach((doc) => {
      productos.push({ id: doc.id, ...doc.data() });
    });

    mostrarProductos(productos);

    filtroTipo.addEventListener("change", () => {
      const tipo = filtroTipo.value;
      if (tipo === "todos") {
        mostrarProductos(productos);
      } else {
        mostrarProductos(productos.filter((p) => p.tipo === tipo));
      }
    });
  } catch (err) {
    console.error("⚠️ Error cargando productos:", err);
    productosLista.innerHTML = "<p>⚠️ Error al cargar productos.</p>";
  }
}

function mostrarProductos(lista) {
  productosLista.innerHTML = "";

  lista.forEach((data) => {
    productosLista.innerHTML += `
      <div class="productos-card" onclick="location.href='producto.html?id=${data.id}'">
        <img src="${data.foto}" alt="${data.titulo}">
        <p>$${data.precio} COP / ${data.tipo}</p>
        <h3>${data.titulo}</h3>
      </div>
    `;
  });
}

cargarProductos();
