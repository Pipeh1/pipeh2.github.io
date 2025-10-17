document.addEventListener("DOMContentLoaded", () => {
  const BODY_CLASS = "modo-oscuro";
  const LS_KEY = "tema";

  const toggles = Array.from(document.querySelectorAll("#toggle-tema"));

  const temaGuardado = localStorage.getItem(LS_KEY);
  if (temaGuardado === "oscuro") {
    document.body.classList.add(BODY_CLASS);
  } else {
    document.body.classList.remove(BODY_CLASS);
  }

  function actualizarTextoToggles() {
    const activo = document.body.classList.contains(BODY_CLASS);
    toggles.forEach(btn => {
      if (!btn) return;
      btn.textContent = activo ? "☀️ Modo claro" : "🌙 Modo oscuro";
    });
  }

  actualizarTextoToggles();

  toggles.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const oscuroActivo = document.body.classList.toggle(BODY_CLASS);
      localStorage.setItem(LS_KEY, oscuroActivo ? "oscuro" : "claro");
      actualizarTextoToggles();
    });
  });

  window.toggleModoOscuro = () => {
    const oscuroActivo = document.body.classList.toggle(BODY_CLASS);
    localStorage.setItem(LS_KEY, oscuroActivo ? "oscuro" : "claro");
    actualizarTextoToggles();
    return oscuroActivo;
  };
});

