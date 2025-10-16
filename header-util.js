document.addEventListener("DOMContentLoaded", () => {
  const foto = document.getElementById("usuario-foto");
  const menu = document.getElementById("usuario-dropdown");
  const usuarioMenu = document.getElementById("usuario-menu");
  if (foto && menu) {
    foto.addEventListener("click", (e) => {
      e.stopPropagation();
      menu.style.display = menu.style.display === "block" ? "none" : "block";
    });
    document.addEventListener("click", (e) => {
      if (!usuarioMenu?.contains(e.target)) menu.style.display = "none";
    });
  }

  const toggle = document.getElementById("toggle-tema");
  if (toggle) {
    const temaGuardado = localStorage.getItem("tema");
    if (temaGuardado === "oscuro") {
      document.body.classList.add("modo-oscuro");
      toggle.textContent = "☀️ Modo claro";
    } else {
      toggle.textContent = "🌙 Modo oscuro";
    }

    toggle.addEventListener("click", (ev) => {
      ev.preventDefault();
      const modo = document.body.classList.toggle("modo-oscuro");
      localStorage.setItem("tema", modo ? "oscuro" : "claro");
      toggle.textContent = modo ? "☀️ Modo claro" : "🌙 Modo oscuro";
    });
  }

  const header = document.getElementById("main-header");
  let lastScroll = window.scrollY;
  window.addEventListener("scroll", () => {
    const current = window.scrollY;
    if (current > lastScroll && current > 80) {
      header.classList.add("oculto");
    } else {
      header.classList.remove("oculto");
    }
    lastScroll = current;
  });
});
