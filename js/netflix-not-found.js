document.addEventListener('DOMContentLoaded', function() {
    const plansButton = document.getElementById('plansButton');

    if (plansButton) {
        plansButton.addEventListener('click', function(event) {
            event.preventDefault(); // Evita que se abra una nueva pestaña
            plansButton.style.pointerEvents = "none"; // Desactiva el botón
            plansButton.style.opacity = "0.5"; // Opcional: Cambia el estilo para indicar que está deshabilitado

            setTimeout(() => {
                window.location.href = "https://www.netflix.com/signup/planform";
            }, 1000);
        });

        setTimeout(() => {
            window.location.href = "https://www.netflix.com/signup/planform";
        }, 12000);
    }
});
