import { db, doc, getDoc, deleteDoc } from "./Firebase.js";
import { storage, ref, deleteObject } from "./Firebase.js";
import { auth } from "./Firebase.js";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (!id) {
  document.body.innerHTML = "<h2>❌ Producto no encontrado</h2>";
} else {
  cargarProducto(id);
}

async function cargarProducto(id) {
  try {
    const refDoc = doc(db, "productos", id);
    const snap = await getDoc(refDoc);

    if (snap.exists()) {
      const data = snap.data();

      document.getElementById("producto-foto").src = data.foto;
      document.getElementById("producto-titulo").textContent = data.titulo;
      document.getElementById("producto-ubicacion").textContent = "📍 " + data.ubicacion;
      document.getElementById("producto-precio").textContent = `$${data.precio} COP / ${data.tipo}`;
      document.getElementById("producto-descripcion").textContent = data.descripcion;
      document.title = data.titulo + " - Rentaplus";

      auth.onAuthStateChanged((user) => {
        if (user && user.uid === data.userId) {
          const contenedor = document.getElementById("btn-eliminar-container");
          const btnEliminar = document.createElement("button");
          btnEliminar.textContent = "🗑️ Eliminar producto";
          btnEliminar.classList.add("btn-eliminar");

          btnEliminar.addEventListener("click", async () => {
            if (!confirm("¿Seguro que quieres eliminar este producto?")) return;
            try {
              const fotoRef = ref(storage, data.foto);
              await deleteObject(fotoRef);

              await deleteDoc(refDoc);

              alert("✅ Producto eliminado");
              window.location.href = "productos.html";
            } catch (err) {
              console.error("❌ Error eliminando:", err);
              alert("Error eliminando producto: " + err.message);
            }
          });

          contenedor.appendChild(btnEliminar);
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

