import {
  auth,
  db,
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  getDocs,
  addDoc,
  serverTimestamp,
} from "./Firebase.js";

const $ = (sel) => document.querySelector(sel);

const imgEl = $("#producto-foto");
const tituloEl = $("#producto-titulo");
const precioEl = $("#producto-precio");
const ubicacionEl = $("#producto-ubicacion");
const descripcionEl = $("#producto-descripcion");

const promedioEl = $("#promedio-estrellas");
const listaComentariosEl = $("#comentarios-lista");
const formComentario = $("#comentario-form");
const selCalificacion = $("#comentario-calificacion");
const txtComentario = $("#comentario-texto");

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

function starsBar(n) {
  const full = Math.round(n); // si prefieres sin redondeo: Math.floor(n)
  const fullStars = "★".repeat(Math.min(full, 5));
  const emptyStars = "☆".repeat(Math.max(5 - full, 0));
  return fullStars + emptyStars;
}

async function cargarProducto() {
  if (!productId) {
    document.body.innerHTML = "<h2>❌ Producto no encontrado</h2>";
    return;
  }

  try {
    const ref = doc(db, "productos", productId);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      document.body.innerHTML = "<h2>❌ Producto no encontrado</h2>";
      return;
    }

    const data = snap.data();
    imgEl.src = data.foto || "";
    imgEl.alt = data.titulo || "Producto";
    tituloEl.textContent = data.titulo || "";
    precioEl.textContent = `${data.precio} COP / ${data.tipo}`;
    ubicacionEl.textContent = `📍 ${data.ubicacion || ""}`;
    descripcionEl.textContent = data.descripcion || "";
    document.title = `${data.titulo} - Rentaplus`;
  } catch (err) {
    console.error("⚠️ Error cargando producto:", err);
    document.body.innerHTML = "<h2>⚠️ Error al cargar producto</h2>";
  }
}

async function cargarComentarios() {
  try {
    const colRef = collection(db, "productos", productId, "comentarios");
    const q = query(colRef, orderBy("creado", "desc"));
    const snap = await getDocs(q);

    let html = "";
    let suma = 0;
    let total = 0;

    if (snap.empty) {
      promedioEl.textContent = "⭐ Promedio: – (0)";
      listaComentariosEl.innerHTML =
        '<p style="color:#777">Sé el primero en comentar.</p>';
      return;
    }

    snap.forEach((docc) => {
      const c = docc.data();
      const cal = Number(c.calificacion) || 0;
      const autor = c.autorNombre || "Usuario";
      const texto = c.texto || "";
      suma += cal;
      total += 1;

      html += `
        <div class="comentario">
          <strong>${autor}</strong>
          <div>${"★".repeat(cal)}${"☆".repeat(5 - cal)}</div>
          <p>${texto}</p>
        </div>
      `;
    });

    const promedio = suma / total;
    const promedioTxt = `${promedio.toFixed(1)} (${total})`;
    promedioEl.innerHTML = `⭐ Promedio: <span style="font-weight:600">${starsBar(
      promedio
    )}</span> <span style="color:#555">${promedioTxt}</span>`;

    listaComentariosEl.innerHTML = html;
  } catch (err) {
    console.error("⚠️ Error cargando comentarios:", err);
    promedioEl.textContent = "⭐ Promedio: –";
    listaComentariosEl.innerHTML =
      '<p style="color:#c00">No se pudieron cargar los comentarios.</p>';
  }
}

if (formComentario) {
  formComentario.addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      alert("Debes iniciar sesión para comentar.");
      return;
    }

    const calificacion = parseInt(selCalificacion.value, 10);
    const texto = (txtComentario.value || "").trim();

    if (!calificacion || calificacion < 1 || calificacion > 5) {
      alert("Selecciona una calificación válida (1–5).");
      return;
    }
    if (!texto) {
      alert("Escribe un comentario.");
      return;
    }

    try {
      const autorNombre = user.displayName || user.email || "Usuario";
      await addDoc(collection(db, "productos", productId, "comentarios"), {
        calificacion,
        texto,
        autorId: user.uid,
        autorNombre,
        creado: serverTimestamp(),
      });

      txtComentario.value = "";
      selCalificacion.value = "5";
      await cargarComentarios();
    } catch (err) {
      console.error("❌ Error al publicar comentario:", err);
      alert("No se pudo publicar el comentario: " + err.message);
    }
  });
}

(async function init() {
  await cargarProducto();
  await cargarComentarios();
})();
