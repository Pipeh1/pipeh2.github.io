import { db, doc, getDoc, collection, getDocs, addDoc, serverTimestamp, auth } from "./Firebase.js";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (!id) {
  document.body.innerHTML = "<h2>❌ Producto no encontrado</h2>";
} else {
  cargarProducto(id);
  cargarComentarios(id);
}

async function cargarProducto(id) {
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
}

function estrellasVisuales(n) {
  return "★".repeat(n) + "☆".repeat(5 - n);
}

async function cargarComentarios(id) {
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
        <p class="comentario-autor"><strong>${data.usuario || "Anónimo"}</strong></p>
        <p class="comentario-rating">${estrellasVisuales(data.estrellas)}</p>
        <p class="comentario-texto">${data.texto}</p>
      </div>
    `;
  });

  document.getElementById("comentarios-lista").innerHTML = html || "<p>Sin comentarios aún</p>";

  if (cantidad > 0) {
    const promedio = (total / cantidad).toFixed(1);
    document.getElementById("producto-rating").innerHTML =
      `${estrellasVisuales(Math.round(promedio))} <span>(${promedio}/5)</span>`;
  } else {
    document.getElementById("producto-rating").textContent = "Sin calificaciones";
  }
}

const form = document.getElementById("comentario-form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const estrellas = parseInt(document.getElementById("estrellas").value);
  const texto = document.getElementById("comentario-texto").value;
  const user = auth.currentUser;

  if (!user) {
    alert("Debes iniciar sesión para comentar");
    return;
  }

  const ref = collection(db, "productos", id, "comentarios");
  await addDoc(ref, {
    usuario: user.displayName || user.email,
    estrellas,
    texto,
    creado: serverTimestamp()
  });

  form.reset();
  cargarComentarios(id);
});
