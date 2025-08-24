import { db, auth, collection, addDoc, getDocs, serverTimestamp } from "./Firebase.js";


const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const btnEliminar = document.getElementById("eliminar-btn");

if (!id) {
  document.body.innerHTML = "<h2>❌ Producto no encontrado</h2>";
} else {
  cargarProducto(id);
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

      auth.onAuthStateChanged(user => {
        if (user && user.uid === data.userId) {
          btnEliminar.style.display = "inline-block";
          btnEliminar.addEventListener("click", async () => {
            if (confirm("¿Seguro que deseas eliminar este producto?")) {
              await deleteDoc(ref);
              alert("Producto eliminado ✅");
              window.location.href = "productos.html";
            }
          });
        }
      });

    } else {
      document.body.innerHTML = "<h2>❌ Producto no encontrado</h2>";
    }
  } catch (err) {
    console.error("⚠️ Error cargando producto:", err);
    document.body.innerHTML = "<h2>⚠️ Error al cargar producto</h2>";
  }
}

import { collection, addDoc, getDocs, serverTimestamp } from "./Firebase.js";

const comentarioForm = document.getElementById("comentario-form");
const comentarioTexto = document.getElementById("comentario-texto");
const estrellasDiv = document.getElementById("estrellas");
const calificacionInput = document.getElementById("calificacion");
const listaComentarios = document.getElementById("lista-comentarios");

if (estrellasDiv) {
  estrellasDiv.innerHTML = ""; 
  for (let i = 1; i <= 5; i++) {
    const s = document.createElement("span");
    s.textContent = "☆"; 
    s.dataset.valor = i;
    s.style.cursor = "pointer";
    s.style.fontSize = "24px";
    s.style.marginRight = "4px";
    estrellasDiv.appendChild(s);
  }

  estrellasDiv.addEventListener("click", (e) => {
    if (e.target.tagName === "SPAN") {
      const val = parseInt(e.target.dataset.valor);
      calificacionInput.value = val;

      [...estrellasDiv.children].forEach((star, idx) => {
        star.textContent = idx < val ? "★" : "☆";
        star.style.color = idx < val ? "orange" : "#ccc";
      });
    }
  });
}

if (comentarioForm) {
  comentarioForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "productos", id, "comentarios"), {
        texto: comentarioTexto.value,
        estrellas: parseInt(calificacionInput.value),
        creado: serverTimestamp()
      });

      comentarioTexto.value = "";
      cargarComentarios(id);
    } catch (err) {
      console.error("⚠️ Error guardando comentario:", err);
      alert("Error guardando comentario: " + err.message);
    }
  });
}

async function cargarComentarios(productoId) {
  listaComentarios.innerHTML = "<p>Cargando reseñas...</p>";

  try {
    const snap = await getDocs(collection(db, "productos", productoId, "comentarios"));
    listaComentarios.innerHTML = "";

    if (snap.empty) {
      listaComentarios.innerHTML = "<p>Sin comentarios aún.</p>";
      return;
    }

    snap.forEach((doc) => {
      const c = doc.data();
      const div = document.createElement("div");
      div.classList.add("comentario");
      div.innerHTML = `
        <p>${"★".repeat(c.estrellas)}${"☆".repeat(5 - c.estrellas)}</p>
        <p>${c.texto}</p>
        <hr>
      `;
      listaComentarios.appendChild(div);
    });
  } catch (err) {
    console.error("⚠️ Error cargando comentarios:", err);
    listaComentarios.innerHTML = "<p>Error cargando comentarios.</p>";
  }
}

cargarComentarios(id);