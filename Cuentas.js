usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
usuarios.push({ usuario, correo, contraseña });
localStorage.setItem('usuarios', JSON.stringify(usuarios));
document.querySelector('.registro-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const usuario = this.querySelector('input[type="text"]').value;
    const correo = this.querySelector('input[type="email"]').value;
    const contraseña = this.querySelector('input[type="password"]').value;

    // Registro de usuario
    if (document.querySelector('.registro-form')) {
        document.querySelector('.registro-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const usuario = this.querySelector('input[type="text"]').value;
            const correo = this.querySelector('input[type="email"]').value;
            const contraseña = this.querySelector('input[type="password"]').value;

            let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            // Validar que el usuario no exista
            if (usuarios.some(u => u.usuario === usuario)) {
                alert('El usuario ya existe');
                return;
            }
            usuarios.push({ usuario, correo, contraseña });
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
            alert('Registro exitoso');
            window.location.href = 'login.html'; // Redirige al login
        });
    }

    // Inicio de sesión
    if (document.querySelector('.login-form')) {
        document.querySelector('.login-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const usuario = this.querySelector('input[type="text"]').value;
            const contraseña = this.querySelector('input[type="password"]').value;

            let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            const usuarioEncontrado = usuarios.find(u => u.usuario === usuario && u.contraseña === contraseña);
            if (usuarioEncontrado) {
                localStorage.setItem('usuarioActual', JSON.stringify(usuarioEncontrado));
                alert('Inicio de sesión exitoso');
                window.location.href = 'index.html'; // Redirige a la página principal
            } else {
                alert('Usuario o contraseña incorrectos');
            }
        });
    }

// Cerrar sesión (puedes llamarlo desde cualquier página)
function cerrarSesion() {
    localStorage.removeItem('usuarioActual');
    window.location.href = 'login.html';
}
});
