import { db, collection, getDocs, query, orderBy } from "./Firebase.js";

const productosLista = document.getElementById("productos-lista");
let productosCache = [];

async function cargarProductos() {
  try {
    const q = query(collection(db, "productos"), orderBy("creado", "desc"));
    const snap = await getDocs(q);

    productosCache = [];
    for (let docSnap of snap.docs) {
      let data = docSnap.data();
      data.id = docSnap.id;

      const comentariosSnap = await getDocs(collection(db, `productos/${docSnap.id}/comentarios`));
      let total = 0, count = 0;
      comentariosSnap.forEach(c => {
        if (c.data().rating) {
          total += c.data().rating;
          count++;
        }
      });
      data.promedio = count > 0 ? (total / count).toFixed(1) : null;

      productosCache.push(data);
    }

    mostrarProductos(productosCache);
  } catch (err) {
    console.error("❌ Error cargando productos:", err);
  }
}

function mostrarProductos(lista) {
  productosLista.innerHTML = "";
  if (lista.length === 0) {
    productosLista.innerHTML = "<p>No se encontraron productos</p>";
    return;
  }

  lista.forEach((data) => {
    productosLista.innerHTML += `
      <div class="producto-item" onclick="location.href='producto.html?id=${data.id}'">
        <img class="producto-img" src="${data.foto}" alt="${data.titulo}">
        <div class="producto-detalles">
          <h2 class="producto-nombre">${data.titulo}</h2>
          <p class="producto-precio">$${data.precio} COP / ${data.tipo}</p>
          <p class="producto-ubicacion">📍 ${data.ubicacion}</p>
          <p class="producto-descripcion">${data.descripcion.substring(0, 80)}...</p>
          ${
            data.promedio 
              ? `<p class="producto-rating">⭐ ${data.promedio} / 5</p>` 
              : `<p class="producto-rating">Sin calificaciones</p>`
          }
        </div>
      </div>
    `;
  });
}

document.getElementById("btn-filtrar").addEventListener("click", () => {
  const tipo = document.getElementById("filtro-tipo").value.toLowerCase();
  const ubicacion = document.getElementById("filtro-ubicacion").value.toLowerCase();
  const precioMax = parseFloat(document.getElementById("filtro-precio").value);

  let filtrados = productosCache.filter((p) => {
    let cumple = true;
    if (tipo && p.tipo.toLowerCase() !== tipo) cumple = false;
    if (ubicacion && !p.ubicacion.toLowerCase().includes(ubicacion)) cumple = false;
    if (!isNaN(precioMax) && parseFloat(p.precio) > precioMax) cumple = false;
    return cumple;
  });

  mostrarProductos(filtrados);
});

document.getElementById("btn-limpiar").addEventListener("click", () => {
  document.getElementById("filtro-tipo").value = "";
  document.getElementById("filtro-ubicacion").value = "";
  document.getElementById("filtro-precio").value = "";
  mostrarProductos(productosCache);
});

cargarProductos();
