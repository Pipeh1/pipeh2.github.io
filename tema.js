
document.addEventListener("DOMContentLoaded", () => {
  const toggleTema = document.getElementById("toggle-tema");
  const body = document.body;
  const temaGuardado = localStorage.getItem("tema");

  if (temaGuardado === "oscuro") {
    body.classList.add("modo-oscuro");
    if (toggleTema) toggleTema.textContent = "☀️ Modo claro";
  }

  if (toggleTema) {
    toggleTema.addEventListener("click", (e) => {
      e.preventDefault();
      const oscuroActivo = body.classList.toggle("modo-oscuro");
      localStorage.setItem("tema", oscuroActivo ? "oscuro" : "claro");
      toggleTema.textContent = oscuroActivo ? "☀️ Modo claro" : "🌙 Modo oscuro";
    });
  }
});
