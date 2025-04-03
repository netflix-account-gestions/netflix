document.addEventListener('DOMContentLoaded', function() {
    const loginButton = document.getElementById('loginButton');

    if (loginButton) {
        loginButton.addEventListener('click', function(event) {
            event.preventDefault(); // Evita que se abra una nueva pestaña
            loginButton.style.pointerEvents = "none"; // Desactiva el botón
            loginButton.style.opacity = "0.5"; // Opcional: Cambia el estilo para indicar que está deshabilitado

            setTimeout(() => {
                window.location.href = "sign-in.html";
            }, 1000);
        });
    }
});
