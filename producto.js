import {
  db, auth,
  doc, getDoc, deleteDoc,
  collection, addDoc, getDocs, serverTimestamp
} from "./Firebase.js"; 

const fotoEl        = document.getElementById("producto-foto");
const tituloEl      = document.getElementById("producto-titulo");
const precioEl      = document.getElementById("producto-precio");
const ubicacionEl   = document.getElementById("producto-ubicacion");
const descripcionEl = document.getElementById("producto-descripcion");
const eliminarBtn   = document.getElementById("eliminar-btn");

const params = new URLSearchParams(location.search);
const productId = params.get("id");

if (!productId) {
  document.body.innerHTML = "<h2 style='padding:24px'>❌ Producto no encontrado</h2>";
  throw new Error("Falta ?id= en la URL");
}

async function cargarProducto() {
  console.log("[producto] Cargando id:", productId);
  const ref = doc(db, "productos", productId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    document.body.innerHTML = "<h2 style='padding:24px'>❌ Producto no encontrado</h2>";
    return;
  }

  const data = snap.data();
  console.log("[producto] Datos:", data);

  if (fotoEl) {
    fotoEl.src = data.foto || "";
    fotoEl.alt = data.titulo || "Producto";
    fotoEl.onerror = () => {
      fotoEl.src =
        "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500'><rect width='100%' height='100%' fill='%23f2f2f2'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='24'>Sin imagen</text></svg>";
    };
  }

  if (tituloEl)      tituloEl.textContent      = data.titulo || "Sin título";
  if (precioEl)      precioEl.textContent      = `${formatCOP(data.precio)} COP / ${data.tipo}`;
  if (ubicacionEl)   ubicacionEl.textContent   = `📍 ${data.ubicacion || ""}`;
  if (descripcionEl) descripcionEl.textContent = data.descripcion || "";

  document.title = `${data.titulo || "Producto"} - Rentaplus`;

  auth.onAuthStateChanged((user) => {
    if (!eliminarBtn) return;
    if (user && user.uid === data.userId) {
      eliminarBtn.style.display = "inline-flex";
      eliminarBtn.onclick = async () => {
        if (!confirm("¿Eliminar este producto?")) return;
        try {
          await deleteDoc(ref);
          alert("Producto eliminado");
          location.href = "productos.html";
        } catch (e) {
          console.error("Error eliminando:", e);
          alert("No se pudo eliminar: " + e.message);
        }
      };
    } else {
      eliminarBtn.style.display = "none";
    }
  });

  prepararEstrellas();
  await cargarComentarios(productId);
  prepararEnvioComentario(productId);
}

function formatCOP(n) {
  const num = Number(n) || 0;
  return new Intl.NumberFormat("es-CO").format(num);
}

async function cargarComentarios(id) {
  const cont = document.getElementById("lista-comentarios");
  if (!cont) return;
  cont.innerHTML = "<p>Cargando comentarios…</p>";

  const ref = collection(db, "productos", id, "comentarios");
  const qs = await getDocs(ref);

  if (qs.empty) {
    cont.innerHTML = "<p>Sin comentarios aún.</p>";
    return;
  }

  cont.innerHTML = "";
  qs.forEach((docSnap) => {
    const c = docSnap.data();
    const item = document.createElement("div");
    item.className = "comentario-item";
    const estrellas = "★".repeat(c.estrellas || 0) + "☆".repeat(5 - (c.estrellas || 0));
    item.innerHTML = `
      <div class="comentario-header">
        <span class="comentario-autor">${escapeHTML(c.autor || "Usuario")}</span>
        <span class="comentario-estrellas">${estrellas}</span>
      </div>
      <p class="comentario-texto">${escapeHTML(c.texto || "")}</p>
    `;
    cont.appendChild(item);
  });
}

function prepararEnvioComentario(id) {
  const form = document.getElementById("comentario-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
      alert("Inicia sesión para comentar");
      return;
    }

    const estrellas = Number(document.getElementById("calificacion").value || 5);
    const texto = (document.getElementById("comentario-texto").value || "").trim();
    if (!texto) {
      alert("Escribe un comentario");
      return;
    }

    try {
      await addDoc(collection(db, "productos", id, "comentarios"), {
        estrellas,
        texto,
        autor: user.displayName || user.email,
        uid: user.uid,
        creado: serverTimestamp(),
      });
      document.getElementById("comentario-texto").value = "";
      await cargarComentarios(id);
      alert("Comentario enviado");
    } catch (e) {
      console.error("Error comentario:", e);
      alert("No se pudo enviar: " + e.message);
    }
  });
}

function prepararEstrellas() {
  const estrellasDiv = document.getElementById("estrellas");
  const calificacionInput = document.getElementById("calificacion");
  if (!estrellasDiv || !calificacionInput) return;

  estrellasDiv.innerHTML = "";
  for (let i = 1; i <= 5; i++) {
    const s = document.createElement("span");
    s.textContent = "☆";
    s.dataset.valor = String(i);
    s.className = "star";
    s.style.cursor = "pointer";
    estrellasDiv.appendChild(s);
  }
  pintar(5);
  calificacionInput.value = "5";

  estrellasDiv.addEventListener("click", (e) => {
    if (e.target && e.target.classList.contains("star")) {
      const v = Number(e.target.dataset.valor);
      calificacionInput.value = String(v);
      pintar(v);
    }
  });

  function pintar(v) {
    [...estrellasDiv.children].forEach((el, idx) => {
      el.textContent = idx < v ? "★" : "☆";
      el.style.color = idx < v ? "orange" : "#bbb";
      el.style.fontSize = "22px";
      el.style.marginRight = "4px";
    });
  }
}

function escapeHTML(s) {
  return s.replace(/[&<>"']/g, (m) => (
    { "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[m]
  ));
}

cargarProducto().catch((e) => {
  console.error("Error general:", e);
  alert("Error al cargar el producto");
});

