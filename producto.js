import { db, doc, getDoc, collection, addDoc, getDocs, serverTimestamp } from "./Firebase.js";
import { auth, onAuthStateChanged } from "./Firebase.js";

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

const form = document.getElementById("comentario-form");
const listaComentarios = document.getElementById("comentarios-lista");
const promedioElemento = document.getElementById("promedio-estrellas");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      alert("Debes iniciar sesión para comentar");
      return;
    }

    const texto = document.getElementById("comentario-texto").value.trim();
    const calificacion = parseInt(document.getElementById("comentario-calificacion").value);

    if (!texto) {
      alert("Escribe un comentario antes de enviar");
      return;
    }

    try {
      await addDoc(collection(db, "productos", id, "comentarios"), {
        usuario: user.displayName || "Anónimo", // 🔹 Solo nombre de usuario
        texto,
        calificacion,
        creado: serverTimestamp()
      });

      form.reset();
      cargarComentarios(id);
    } catch (err) {
      console.error("Error guardando comentario:", err);
      alert("Error al enviar comentario: " + err.message);
    }
  });
}

async function cargarComentarios(id) {
  listaComentarios.innerHTML = "";
  let suma = 0;
  let total = 0;

  try {
    const snap = await getDocs(collection(db, "productos", id, "comentarios"));
    snap.forEach((doc) => {
      const data = doc.data();

      const div = document.createElement("div");
      div.classList.add("comentario");

      div.innerHTML = `
        <p><strong>${data.usuario}</strong></p>
        <p>${"★".repeat(data.calificacion)}${"☆".repeat(5 - data.calificacion)}</p>
        <p>${data.texto}</p>
      `;

      listaComentarios.appendChild(div);

      suma += data.calificacion;
      total++;
    });

    if (total > 0) {
      const promedio = (suma / total).toFixed(1);
      promedioElemento.textContent = `⭐ ${promedio} / 5 (${total} opiniones)`;
    } else {
      promedioElemento.textContent = "Sin calificaciones aún";
    }
  } catch (err) {
    console.error("Error cargando comentarios:", err);
  }
}
