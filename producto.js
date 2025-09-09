import { 
  db, auth, doc, getDoc, collection, addDoc, getDocs, serverTimestamp, deleteDoc 
} from "./Firebase.js";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const listaComentarios = document.getElementById("comentarios-lista");
const form = document.getElementById("comentario-form");
const promedioEstrellas = document.getElementById("promedio-estrellas");

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
  }
}

async function cargarComentarios(id) {
  listaComentarios.innerHTML = "";
  const q = collection(db, "productos", id, "comentarios");
  const querySnap = await getDocs(q);

  let total = 0;
  let count = 0;

  querySnap.forEach(docSnap => {
    const data = docSnap.data();

    const div = document.createElement("div");
    div.classList.add("comentario");
    div.innerHTML = `
      <strong>${data.usuario || "Anónimo"}</strong>
      <p>${"⭐".repeat(data.calificacion)} (${data.calificacion})</p>
      <p>${data.texto}</p>
      <hr>
    `;
    listaComentarios.appendChild(div);

    total += data.calificacion;
    count++;
  });

  if (count > 0) {
    const promedio = (total / count).toFixed(1);
    promedioEstrellas.textContent = `⭐ Promedio: ${promedio} / 5`;
  } else {
    promedioEstrellas.textContent = "⭐ Promedio: -";
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const texto = document.getElementById("comentario-texto").value.trim();
  const calificacion = parseInt(document.getElementById("comentario-calificacion").value);

  if (!texto) {
    alert("⚠️ Escribe un comentario");
    return;
  }

  const user = auth.currentUser;

  try {
    await addDoc(collection(db, "productos", id, "comentarios"), {
      usuario: user?.displayName || user?.email || "Anónimo",
      texto,
      calificacion,
      fecha: serverTimestamp()
    });

    form.reset();
    cargarComentarios(id);
  } catch (err) {
    console.error("⚠️ Error enviando comentario:", err);
  }
});

document.getElementById("eliminar-btn").addEventListener("click", async () => {
  if (confirm("¿Seguro que deseas eliminar este producto?")) {
    try {
      await deleteDoc(doc(db, "productos", id));
      alert("✅ Producto eliminado");
      window.location.href = "productos.html";
    } catch (err) {
      console.error("⚠️ Error eliminando producto:", err);
    }
  }
});

if (!id) {
  document.body.innerHTML = "<h2>❌ Producto no encontrado</h2>";
} else {
  cargarProducto(id);
  cargarComentarios(id);
}
