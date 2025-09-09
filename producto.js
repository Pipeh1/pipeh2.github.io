import { db, doc, getDoc, collection, addDoc, query, where, getDocs, serverTimestamp } from "./Firebase.js";
import { auth } from "./Firebase.js";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (id) cargarProducto(id);

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

    cargarComentarios(id);
  }
}

async function cargarComentarios(productoId) {
  const q = query(collection(db, "comentarios"), where("productoId", "==", productoId));
  const querySnapshot = await getDocs(q);

  let totalEstrellas = 0;
  let cantidad = 0;
  const lista = document.getElementById("comentarios-lista");
  lista.innerHTML = "";

  querySnapshot.forEach((docSnap) => {
    const c = docSnap.data();
    cantidad++;
    totalEstrellas += c.estrellas;

    const div = document.createElement("div");
    div.classList.add("comentario");
    div.innerHTML = `
      <p><strong>${c.usuario}</strong> - ${mostrarEstrellas(c.estrellas)}</p>
      <p>${c.texto}</p>
    `;
    lista.appendChild(div);
  });

  const promedioElem = document.getElementById("promedio-estrellas");
  if (cantidad > 0) {
    const promedio = (totalEstrellas / cantidad).toFixed(1);
    promedioElem.innerHTML = `
      ${mostrarEstrellas(Math.round(promedio))}
      <span>(${promedio} de 5 - ${cantidad} calificaciones)</span>
    `;
  } else {
    promedioElem.textContent = "⭐ Aún no hay calificaciones";
  }
}

function mostrarEstrellas(num) {
  let estrellas = "";
  for (let i = 1; i <= 5; i++) {
    estrellas += i <= num ? `<span class="estrella-activa">★</span>` : `<span>☆</span>`;
  }
  return `<span class="estrellas">${estrellas}</span>`;
}

const form = document.getElementById("comentario-form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = auth.currentUser;
  if (!user) {
    alert("Debes iniciar sesión para comentar");
    return;
  }

  const estrellas = parseInt(document.getElementById("estrellas").value);
  const texto = document.getElementById("comentario-texto").value;

  try {
    await addDoc(collection(db, "comentarios"), {
      productoId: id,
      usuario: user.displayName || user.email,
      estrellas,
      texto,
      creado: serverTimestamp()
    });

    alert("✅ Comentario publicado");
    form.reset();
    cargarComentarios(id);
  } catch (err) {
    console.error("❌ Error al guardar comentario:", err);
    alert("Error: " + err.message);
  }
});
