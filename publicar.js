console.log("✅ publicar.js cargado correctamente");

import { db, storage, ref, uploadBytes, getDownloadURL, collection, addDoc, serverTimestamp } from "./Firebase.js";
import { auth } from "./Firebase.js";

console.log("📌 publicar.js cargado");

const form = document.getElementById("publicar-form");
console.log("📌 Form encontrado:", form);
if (!form) {
  console.error("❌ No se encontró el formulario de publicación");
}
const fotoInput = document.getElementById("foto");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  console.log("📤 Enviando formulario de publicación...");

  const user = auth.currentUser;
  if (!user) {
    alert("Debes iniciar sesión para publicar");
    return;
  }

  try {
    if (!fotoInput.files || fotoInput.files.length === 0) {
      alert("Debes seleccionar una foto del producto");
      return;
    }

    const archivo = fotoInput.files[0];
    console.log("📸 Archivo seleccionado:", archivo);

    const storageRef = ref(storage, `productos/${user.uid}/${Date.now()}_${archivo.name}`);

    try {
      await uploadBytes(storageRef, archivo);
    } catch (err) {
      console.error("❌ Error subiendo archivo a Storage:", err);
      alert("Error al subir la foto. Revisa tu conexión e intenta de nuevo.");
      return;
    }

    const fotoURL = await getDownloadURL(storageRef);
    console.log("✅ Foto subida correctamente:", fotoURL);

    await addDoc(collection(db, "productos"), {
      titulo: document.getElementById("titulo").value,
      descripcion: document.getElementById("descripcion").value,
      ubicacion: document.getElementById("ubicacion").value,
      precio: Number(document.getElementById("precio").value),
      tipo: document.getElementById("tipo").value,
      foto: fotoURL,
      userId: user.uid,
      creado: serverTimestamp()
    });
    console.log("✅ Producto publicado correctamente");

    alert("Producto publicado ✅");
    form.reset();
  } catch (err) {
    console.error("❌ Error publicando:", err);
    alert("Error: " + err.message);
  }
});