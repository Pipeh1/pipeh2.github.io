import { db, doc, getDoc, deleteDoc, auth } from "./Firebase.js";

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

