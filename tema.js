
const temaGuardado = localStorage.getItem("tema");
if (temaGuardado === "oscuro") {
  document.body.classList.add("modo-oscuro");
}

document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggle-tema");
  if (!toggleBtn) return;

  toggleBtn.textContent = document.body.classList.contains("modo-oscuro")
    ? "☀️ Modo claro"
    : "🌙 Modo oscuro";

  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("modo-oscuro");

    const temaActual = document.body.classList.contains("modo-oscuro")
      ? "oscuro"
      : "claro";

    localStorage.setItem("tema", temaActual);
    toggleBtn.textContent =
      temaActual === "oscuro" ? "☀️ Modo claro" : "🌙 Modo oscuro";
  });
});
