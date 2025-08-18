import { auth, updateProfile, storage, ref, uploadBytes, getDownloadURL } from "./firebase.js";

const form = document.getElementById("perfil-form");
const nombreInput = document.getElementById("nombre");
const fotoInput = document.getElementById("foto");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const user = auth.currentUser;

  if (!user) {
    alert("Debes iniciar sesión primero");
    return;
  }

  try {
    let photoURL = user.photoURL; // por defecto la que ya tenga

    if (fotoInput.files.length > 0) {
      const archivo = fotoInput.files[0];
      const storageRef = ref(storage, `perfiles/${user.uid}/${archivo.name}`);
      await uploadBytes(storageRef, archivo); // sube a Firebase Storage
      photoURL = await getDownloadURL(storageRef); // obtiene la URL pública
    }

    await updateProfile(user, {
      displayName: nombreInput.value || user.displayName,
      photoURL
    });

    alert("Perfil actualizado ✅");
    window.location.href = "index.html"; // redirige al inicio
  } catch (err) {
    console.error("Error al actualizar perfil:", err);
    alert("Error: " + err.message);
  }
});
