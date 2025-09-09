import { db, doc, getDoc, collection, getDocs } from "./Firebase.js";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (!id) {
  document.body.innerHTML = "<h2>❌ Producto no encontrado</h2>";
} else {
  cargarProducto(id);
  cargarComentarios(id);
}

async function cargarProducto(id) {
  try {
    const ref = doc(db, "productos", id);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data();

      document.getElementById("producto-foto").src = data.foto;
      document.getElementById("producto-titulo").textContent = data.titulo;
      document.getElementById("producto-ubicacion").textContent = "📍 " + data.ubicacion;
      document.getElementById("producto-precio").textContent = `$${data.precio} COP / ${data.tipo}`;
      document.getElementById("producto-descripcion").textContent = data.descripcion;
      document.title = data.titulo + " - Rentaplus";
    } else {
      document.body.innerHTML = "<h2>❌ Producto no encontrado</h2>";
    }
  } catch (err) {
    console.error("⚠️ Error cargando producto:", err);
    document.body.innerHTML = "<h2>⚠️ Error al cargar producto</h2>";
  }
}

function generarEstrellas(promedio) {
  const llenas = Math.floor(promedio);
  const media = promedio % 1 >= 0.5 ? 1 : 0;
  const vacias = 5 - llenas - media;

  return "★".repeat(llenas) + (media ? "⯨" : "") + "☆".repeat(vacias);
}

async function cargarComentarios(id) {
  try {
    const ref = collection(db, "productos", id, "comentarios");
    const snap = await getDocs(ref);

    let total = 0;
    let cantidad = 0;
    let html = "";

    snap.forEach(doc => {
      const data = doc.data();
      total += data.estrellas;
      cantidad++;

      html += `
        <div class="comentario">
          <p class="comentario-rating">${generarEstrellas(data.estrellas)}</p>
          <p class="comentario-texto">${data.texto}</p>
        </div>
      `;
    });

    document.getElementById("comentarios-lista").innerHTML = html || "<p>Sin comentarios aún</p>";

    if (cantidad > 0) {
      const promedio = (total / cantidad).toFixed(1);
      document.getElementById("producto-rating").innerHTML =
        `${generarEstrellas(promedio)} <span>(${promedio} / 5)</span>`;
    } else {
      document.getElementById("producto-rating").textContent = "Sin calificaciones";
    }
  } catch (err) {
    console.error("⚠️ Error cargando comentarios:", err);
  }
}
