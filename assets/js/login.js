/**
 * ==========================================================================
 * TU ESPACIO — GESTIÓN DE AUTENTICACIÓN Y REGISTRO (login.js)
 * Manejo de inicio de sesión, creación de cuenta, modo invitado y tema
 * ==========================================================================
 */

/* ==========================================================================
   1. CONSTANTES Y ESTADO
   ========================================================================== */
const STORAGE_KEYS = {
    TEMA: 'temaPreferido',
    USUARIO: 'usuarioLogueado',
    NOMBRE_USUARIO: 'nombreUsuario',
    NOTAS: 'tu_espacio_notas',
    ALERTA_LOGIN: 'mostrarAlertaLogin',
    ALERTA_GOOGLE: 'mostrarAlertaGoogle',
    ALERTA_REGISTRO: 'mostrarAlertaRegistro'
};

const RUTAS_LOGOS = {
    CLARO: './assets/img/logos/claro-cerca.png',
    OSCURO: './assets/img/logos/oscuro-cerca.png'
};

/* ==========================================================================
   2. ELEMENTOS DEL DOM
   ========================================================================== */
// Encabezado de la tarjeta
const logoApp = document.getElementById('logo-app');
const tituloPantalla = document.getElementById('titulo-pantalla');
const subtituloPantalla = document.getElementById('subtitulo-pantalla');

// Formularios
const formularioLogin = document.getElementById('formulario-login');
const formularioRegistro = document.getElementById('formulario-registro');

// Enlaces de alternancia
const linkIrRegistro = document.getElementById('link-ir-registro');
const linkIrLogin = document.getElementById('link-ir-login');

// Botones de acción rápida
const btnInvitado = document.getElementById('btn-invitado');
const btnGoogle = document.getElementById('btn-google');

// Campos de Registro
const regNombre = document.getElementById('reg-nombre');
const regCorreo = document.getElementById('reg-correo');
const regContrasena = document.getElementById('reg-contrasena');
const regConfirmar = document.getElementById('reg-confirmar');
const errorPassword = document.getElementById('error-password');

/* ==========================================================================
   3. INICIALIZACIÓN Y CONFIGURACIÓN DE VISTA
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    // Sincronizar tema seleccionado
    const modoGuardado = localStorage.getItem(STORAGE_KEYS.TEMA);
    if (modoGuardado === 'oscuro') {
        document.body.classList.add('modo-oscuro');
        if (logoApp) logoApp.src = RUTAS_LOGOS.OSCURO;
    } else {
        document.body.classList.remove('modo-oscuro');
        if (logoApp) logoApp.src = RUTAS_LOGOS.CLARO;
    }

    // Si viene con el hash #registro, abrir directamente la vista de crear cuenta
    if (window.location.hash === '#registro') {
        mostrarVistaRegistro();
    }
});

/* ==========================================================================
   4. FUNCIONES DE INTERCAMBIO DE VISTAS (LOGIN <-> REGISTRO)
   ========================================================================== */
function mostrarVistaRegistro() {
    if (formularioLogin && formularioRegistro) {
        formularioLogin.classList.add('d-none');
        formularioRegistro.classList.remove('d-none');
        if (tituloPantalla) tituloPantalla.textContent = '¡Crea tu cuenta!';
        if (subtituloPantalla) subtituloPantalla.textContent = 'Empieza a organizar tus notas en tu lugar en el mundo.';
        if (errorPassword) errorPassword.classList.add('d-none');
    }
}

function mostrarVistaLogin() {
    if (formularioLogin && formularioRegistro) {
        formularioRegistro.classList.add('d-none');
        formularioLogin.classList.remove('d-none');
        if (tituloPantalla) tituloPantalla.textContent = '¡Te damos la bienvenida!';
        if (subtituloPantalla) subtituloPantalla.textContent = 'Organiza tus ideas en tu lugar en el mundo.';
    }
}

/* ==========================================================================
   5. CONTROLADORES DE EVENTOS (EVENT LISTENERS)
   ========================================================================== */

// 5.1. ALTERNANCIA ENTRE FORMULARIOS
if (linkIrRegistro) {
    linkIrRegistro.addEventListener('click', (e) => {
        e.preventDefault();
        mostrarVistaRegistro();
    });
}

if (linkIrLogin) {
    linkIrLogin.addEventListener('click', (e) => {
        e.preventDefault();
        mostrarVistaLogin();
    });
}

// 5.2. INICIO DE SESIÓN REGULAR (CON CORREO O NOMBRE DE USUARIO)
if (formularioLogin) {
    formularioLogin.addEventListener('submit', (e) => {
        e.preventDefault();

        const inputIdentificador = document.getElementById('identificador');
        const identificador = inputIdentificador ? inputIdentificador.value.trim() : '';

        if (identificador) {
            // Si ingresó correo (ej. mili@correo.com), toma 'mili', si ingresó usuario directo lo conserva
            const nombreMostrar = identificador.includes('@') ? identificador.split('@')[0] : identificador;
            localStorage.setItem(STORAGE_KEYS.NOMBRE_USUARIO, nombreMostrar);
        }

        // Establecer estado de usuario registrado
        localStorage.setItem(STORAGE_KEYS.ALERTA_LOGIN, 'si');
        localStorage.setItem(STORAGE_KEYS.USUARIO, 'normal');

        window.location.href = 'index.html';
    });
}

// 5.3. CREACIÓN DE CUENTA (REGISTRO)
if (formularioRegistro) {
    formularioRegistro.addEventListener('submit', (e) => {
        e.preventDefault();

        const pass = regContrasena.value;
        const confirmPass = regConfirmar.value;

        // Validación de coincidencia de contraseñas
        if (pass !== confirmPass) {
            if (errorPassword) errorPassword.classList.remove('d-none');
            regConfirmar.focus();
            return;
        }

        if (errorPassword) errorPassword.classList.add('d-none');

        // Guardar estado simulado de registro exitoso y nombre de usuario
        const nombre = regNombre.value.trim();
        localStorage.setItem(STORAGE_KEYS.ALERTA_REGISTRO, 'si');
        localStorage.setItem(STORAGE_KEYS.USUARIO, 'normal');
        if (nombre) {
            localStorage.setItem(STORAGE_KEYS.NOMBRE_USUARIO, nombre);
        }

        window.location.href = 'index.html';
    });
}

// 5.4. CONTINUAR COMO INVITADO
if (btnInvitado) {
    btnInvitado.addEventListener('click', () => {
        localStorage.removeItem(STORAGE_KEYS.USUARIO);
        localStorage.removeItem(STORAGE_KEYS.NOMBRE_USUARIO);
        localStorage.removeItem(STORAGE_KEYS.NOTAS);
        window.location.href = 'index.html';
    });
}

// 5.5. INICIO DE SESIÓN CON GOOGLE (SIMULADO)
if (btnGoogle) {
    btnGoogle.addEventListener('click', () => {
        localStorage.setItem(STORAGE_KEYS.ALERTA_GOOGLE, 'si');
        localStorage.setItem(STORAGE_KEYS.USUARIO, 'google');
        localStorage.removeItem(STORAGE_KEYS.NOMBRE_USUARIO);

        window.location.href = 'index.html';
    });
}
