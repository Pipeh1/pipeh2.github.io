import {
  auth,
  updateProfile,
  onAuthStateChanged,
  storage,
  ref,
  uploadBytes,
  getDownloadURL
} from "./Firebase.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("perfil-form");
  const nombreInput = document.getElementById("nombre");
  const fotoInput = document.getElementById("foto");

  onAuthStateChanged(auth, user => {
    if (user) {
      nombreInput.value = user.displayName || "";
    } else {
      window.location.href = "login.html"; 
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = nombreInput.value;
    const archivo = fotoInput.files[0];
    let nuevaURL = null;

    try {
      if (archivo) {
        const ruta = `fotos-perfil/${auth.currentUser.uid}/${archivo.name}`;
        const storageRef = ref(storage, ruta);
        await uploadBytes(storageRef, archivo);
        nuevaURL = await getDownloadURL(storageRef);
      }

      await updateProfile(auth.currentUser, {
        displayName: nombre,
        photoURL: nuevaURL || auth.currentUser.photoURL
      });

      alert("Perfil actualizado correctamente");
      window.location.reload();
    } catch (error) {
      alert("Error al actualizar perfil: " + error.message);
    }
  });
});
