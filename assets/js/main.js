/**
 * ==========================================================================
 * TU ESPACIO — SCRIPT PRINCIPAL (main.js)
 * Aplicación de notas minimalista y accesible
 * ==========================================================================
 */

/* ==========================================================================
   1. CONSTANTES Y ESTADO GLOBAL
   ========================================================================== */
const STORAGE_KEYS = {
    TEMA: 'temaPreferido',
    USUARIO: 'usuarioLogueado',
    NOMBRE_USUARIO: 'nombreUsuario',
    AVATAR: 'avatarSeleccionado',
    NOTAS: 'tu_espacio_notas',
    ALERTA_LOGIN: 'mostrarAlertaLogin',
    ALERTA_GOOGLE: 'mostrarAlertaGoogle',
    ALERTA_LOGOUT: 'mostrarAlertaLogout',
    ALERTA_REGISTRO: 'mostrarAlertaRegistro'
};

const RUTAS_LOGOS = {
    CLARO: './assets/img/logos/claro-cerca.png',
    OSCURO: './assets/img/logos/oscuro-cerca.png'
};

const RUTAS_AVATARES = './assets/img/avatars/';

// Estado de la aplicación
let notas = [];
let notaSeleccionadaId = null;
let notaParaEditarId = null;
let notaParaEliminarId = null;
let debounceGuardadoTimer = null;

// Configuración de herramientas para el editor Quill
const OPCIONES_QUILL = [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
    ['clean']
];

/* ==========================================================================
   2. ELEMENTOS DEL DOM
   ========================================================================== */
// Header y navegación
const logoApp = document.getElementById('logo-app');
const btnLuna = document.getElementById('btn-luna');
const iconoLuna = btnLuna ? btnLuna.querySelector('i') : null;
const btnPerfil = document.getElementById('btn-perfil');
const avatarIcono = document.getElementById('avatar-actual-icono');
const avatarImg = document.getElementById('avatar-actual-img');
const badgeEstadoUsuario = document.getElementById('badge-estado-usuario');

// Opciones del Dropdown de usuario
const opcionLogin = document.getElementById('opcion-login');
const opcionCambiarFoto = document.getElementById('opcion-cambiar-foto');
const divisorMenu = document.getElementById('divisor-menu');
const opcionLogout = document.getElementById('opcion-logout');

// Barra lateral y acciones de notas
const btnOjo = document.getElementById('btn-ojo');
const iconoOjo = document.getElementById('icono-ojo');
const menuLateral = document.getElementById('menu-lateral');
const btnAnadirNota = document.getElementById('btn-anadir-nota');
const btnEliminarTodas = document.getElementById('btn-eliminar-todas');
const listaNotas = document.getElementById('lista-notas');
const lienzoCentral = document.getElementById('lienzo-central');

// Alertas flotantes
const alertaBienvenida = document.getElementById('alerta-bienvenida');
const botonesAvatar = document.querySelectorAll('.btn-opcion-avatar');

// Modales y formularios asociados
const modalLimiteInvitadoEl = document.getElementById('modalLimiteInvitado');
let modalLimiteInvitadoInstance = null;

const modalEditarTituloEl = document.getElementById('modalEditarTitulo');
const formEditarTitulo = document.getElementById('form-editar-titulo');
const inputNuevoTitulo = document.getElementById('input-nuevo-titulo');
let modalEditarTituloInstance = null;

const modalEliminarNotaEl = document.getElementById('modalEliminarNota');
const btnConfirmarEliminar = document.getElementById('btn-confirmar-eliminar');
let modalEliminarNotaInstance = null;

const modalEliminarTodasEl = document.getElementById('modalEliminarTodas');
const btnConfirmarEliminarTodas = document.getElementById('btn-confirmar-eliminar-todas');
let modalEliminarTodasInstance = null;

/* ==========================================================================
   3. INICIALIZACIÓN Y CONFIGURACIÓN
   ========================================================================== */
// Inicialización del editor Quill
const editorQuill = new Quill('#entrada-texto', {
    modules: {
        toolbar: OPCIONES_QUILL
    },
    placeholder: '¿Qué vas a escribir hoy? Escribe con tranquilidad...',
    theme: 'snow'
});

// Instancias de modales de Bootstrap
if (typeof bootstrap !== 'undefined') {
    if (modalLimiteInvitadoEl) {
        modalLimiteInvitadoInstance = new bootstrap.Modal(modalLimiteInvitadoEl);
    }
    if (modalEditarTituloEl) {
        modalEditarTituloInstance = new bootstrap.Modal(modalEditarTituloEl);
    }
    if (modalEliminarNotaEl) {
        modalEliminarNotaInstance = new bootstrap.Modal(modalEliminarNotaEl);
    }
    if (modalEliminarTodasEl) {
        modalEliminarTodasInstance = new bootstrap.Modal(modalEliminarTodasEl);
    }
}

// Ejecutar ciclo inicial al cargar el documento
document.addEventListener('DOMContentLoaded', () => {
    inicializarTema();
    inicializarEstadoUsuario();
    inicializarAlertas();
    cargarNotas();
});

/* ==========================================================================
   4. FUNCIONES DE LA APLICACIÓN
   ========================================================================== */

/**
 * 4.1. GESTIÓN DE TEMA (CLARO / OSCURO)
 */
function inicializarTema() {
    const modoGuardado = localStorage.getItem(STORAGE_KEYS.TEMA);
    if (modoGuardado === 'oscuro') {
        aplicarTemaOscuro(true);
    } else {
        aplicarTemaOscuro(false);
    }
}

function aplicarTemaOscuro(esOscuro) {
    if (esOscuro) {
        document.body.classList.add('modo-oscuro');
        if (logoApp) logoApp.src = RUTAS_LOGOS.OSCURO;
        if (iconoLuna) iconoLuna.className = 'bi bi-sun';
        localStorage.setItem(STORAGE_KEYS.TEMA, 'oscuro');
    } else {
        document.body.classList.remove('modo-oscuro');
        if (logoApp) logoApp.src = RUTAS_LOGOS.CLARO;
        if (iconoLuna) iconoLuna.className = 'bi bi-moon';
        localStorage.setItem(STORAGE_KEYS.TEMA, 'claro');
    }
}

function toggleTema() {
    const esOscuro = !document.body.classList.contains('modo-oscuro');
    aplicarTemaOscuro(esOscuro);
}

/**
 * 4.2. GESTIÓN DE USUARIO Y SESIÓN (INVITADO VS REGISTRADO)
 */
function esUsuarioLogueado() {
    const estado = localStorage.getItem(STORAGE_KEYS.USUARIO);
    return estado === 'normal' || estado === 'google';
}

function inicializarEstadoUsuario() {
    const logueado = esUsuarioLogueado();
    const avatarGuardado = localStorage.getItem(STORAGE_KEYS.AVATAR);

    if (logueado) {
        // Interfaz para usuario registrado
        if (opcionLogin) opcionLogin.classList.add('d-none');
        if (opcionCambiarFoto) opcionCambiarFoto.classList.remove('d-none');
        if (divisorMenu) divisorMenu.classList.remove('d-none');
        if (opcionLogout) opcionLogout.classList.remove('d-none');

        if (badgeEstadoUsuario) {
            badgeEstadoUsuario.classList.add('d-none');
        }

        // Cargar avatar personalizado
        if (avatarGuardado && avatarImg && avatarIcono) {
            avatarImg.src = `${RUTAS_AVATARES}${avatarGuardado}`;
            avatarImg.classList.remove('d-none');
            avatarIcono.classList.add('d-none');
        }
    } else {
        // Interfaz para usuario invitado
        if (opcionLogin) opcionLogin.classList.remove('d-none');
        if (opcionCambiarFoto) opcionCambiarFoto.classList.add('d-none');
        if (divisorMenu) divisorMenu.classList.add('d-none');
        if (opcionLogout) opcionLogout.classList.add('d-none');

        if (badgeEstadoUsuario) {
            badgeEstadoUsuario.classList.remove('d-none');
        }

        if (avatarImg && avatarIcono) {
            avatarImg.classList.add('d-none');
            avatarIcono.classList.remove('d-none');
        }
    }
}

function cerrarSesion() {
    // Limpiar notas de la sesión para que el modo invitado inicie limpio
    localStorage.removeItem(STORAGE_KEYS.NOTAS);

    localStorage.setItem(STORAGE_KEYS.ALERTA_LOGOUT, 'si');
    localStorage.removeItem(STORAGE_KEYS.USUARIO);
    localStorage.removeItem(STORAGE_KEYS.AVATAR);
    localStorage.removeItem(STORAGE_KEYS.NOMBRE_USUARIO);

    window.location.href = 'index.html';
}

function cambiarAvatar(nombreAvatar) {
    localStorage.setItem(STORAGE_KEYS.AVATAR, nombreAvatar);
    if (avatarIcono) avatarIcono.classList.add('d-none');
    if (avatarImg) {
        avatarImg.src = `${RUTAS_AVATARES}${nombreAvatar}`;
        avatarImg.classList.remove('d-none');
    }

    const modalElemento = document.getElementById('modalAvatares');
    if (modalElemento && typeof bootstrap !== 'undefined') {
        const modalInstancia = bootstrap.Modal.getInstance(modalElemento);
        if (modalInstancia) modalInstancia.hide();
    }
}

/**
 * 4.3. GESTIÓN DE NOTAS Y PERSISTENCIA (LOCALSTORAGE)
 */
function guardarNotasEnStorage() {
    try {
        localStorage.setItem(STORAGE_KEYS.NOTAS, JSON.stringify(notas));
    } catch (error) {
        console.error('Error al guardar notas en localStorage:', error);
    }
}

function cargarNotas() {
    try {
        const notasGuardadas = localStorage.getItem(STORAGE_KEYS.NOTAS);
        if (notasGuardadas) {
            notas = JSON.parse(notasGuardadas);
        } else {
            notas = [];
        }
    } catch (error) {
        console.error('Error al cargar notas:', error);
        notas = [];
    }

    renderizarListaNotas();

    // Si existen notas, seleccionar la primera
    if (notas.length > 0) {
        seleccionarNota(notas[0].id);
    } else {
        if (lienzoCentral) lienzoCentral.classList.add('d-none');
        notaSeleccionadaId = null;
    }
}

function renderizarListaNotas() {
    if (!listaNotas) return;
    listaNotas.innerHTML = '';

    // Visibilidad del botón "Eliminar todas"
    if (btnEliminarTodas) {
        if (notas.length > 1) {
            btnEliminarTodas.classList.remove('d-none');
        } else {
            btnEliminarTodas.classList.add('d-none');
        }
    }

    // Estado vacío si no hay notas
    if (notas.length === 0) {
        listaNotas.innerHTML = `
            <li class="text-center py-4 text-muted opacity-75">
                <i class="bi bi-journal-plus fs-3 d-block mb-1"></i>
                <span class="small">Aún no tienes notas.<br>¡Crea tu primera nota arriba!</span>
            </li>
        `;
        return;
    }

    notas.forEach((nota) => {
        const li = document.createElement('li');
        li.className = `nota-item d-flex justify-content-between align-items-center p-2 rounded-2 mb-1 ${nota.id === notaSeleccionadaId ? 'activa' : ''}`;
        li.dataset.id = nota.id;

        // Título de la nota
        const spanTexto = document.createElement('span');
        spanTexto.className = 'titulo-nota d-flex align-items-center text-truncate me-2';
        spanTexto.innerHTML = `<i class="bi bi-file-earmark-text me-2 flex-shrink-0"></i><span class="text-truncate">${nota.titulo}</span>`;
        li.appendChild(spanTexto);

        // Contenedor de acciones
        const divAcciones = document.createElement('div');
        divAcciones.className = 'd-flex gap-1 flex-shrink-0';

        // Botón Editar Título (Abre modal personalizado)
        const btnEditar = document.createElement('button');
        btnEditar.className = 'btn-nota-accion';
        btnEditar.title = 'Editar título';
        btnEditar.innerHTML = '<i class="bi bi-pencil-square"></i>';
        btnEditar.addEventListener('click', (e) => {
            e.stopPropagation();
            abrirModalEditarTitulo(nota.id);
        });

        // Botón Borrar (Abre modal personalizado)
        const btnBorrar = document.createElement('button');
        btnBorrar.className = 'btn-nota-accion';
        btnBorrar.title = 'Eliminar nota';
        btnBorrar.innerHTML = '<i class="bi bi-trash"></i>';
        btnBorrar.addEventListener('click', (e) => {
            e.stopPropagation();
            abrirModalEliminarNota(nota.id);
        });

        divAcciones.appendChild(btnEditar);
        divAcciones.appendChild(btnBorrar);
        li.appendChild(divAcciones);

        // Evento al seleccionar nota
        li.addEventListener('click', () => {
            seleccionarNota(nota.id);
        });

        listaNotas.appendChild(li);
    });
}

function seleccionarNota(id) {
    const nota = notas.find(n => n.id === id);
    if (!nota) return;

    notaSeleccionadaId = id;

    // Mostrar lienzo
    if (lienzoCentral) lienzoCentral.classList.remove('d-none');

    // Actualizar clases activas en la lista
    const items = listaNotas.querySelectorAll('.nota-item');
    items.forEach(item => {
        if (item.dataset.id === id) {
            item.classList.add('activa');
        } else {
            item.classList.remove('activa');
        }
    });

    // Cargar contenido en Quill de forma segura
    const contenido = nota.contenido || '<p><br></p>';
    editorQuill.clipboard.dangerouslyPasteHTML(contenido);
}

function crearNuevaNota() {
    // REGLA: Límite de 1 nota para el usuario invitado
    if (!esUsuarioLogueado() && notas.length >= 1) {
        mostrarModalLimiteInvitado();
        return;
    }

    const nuevaNota = {
        id: 'nota_' + Date.now(),
        titulo: `Sin título (${notas.length + 1})`,
        contenido: '<p><br></p>',
        fechaCreacion: new Date().toISOString()
    };

    notas.push(nuevaNota);
    guardarNotasEnStorage();
    renderizarListaNotas();
    seleccionarNota(nuevaNota.id);
}

/**
 * 4.4. MODALES PERSONALIZADOS DE NOTAS (EDITAR, BORRAR INDIVIDUAL Y BORRAR TODAS)
 */
function abrirModalEditarTitulo(id) {
    const nota = notas.find(n => n.id === id);
    if (!nota) return;

    notaParaEditarId = id;
    if (inputNuevoTitulo) {
        inputNuevoTitulo.value = nota.titulo;
    }

    if (!modalEditarTituloInstance && modalEditarTituloEl && typeof bootstrap !== 'undefined') {
        modalEditarTituloInstance = new bootstrap.Modal(modalEditarTituloEl);
    }
    if (modalEditarTituloInstance) {
        modalEditarTituloInstance.show();
        setTimeout(() => {
            if (inputNuevoTitulo) {
                inputNuevoTitulo.focus();
                inputNuevoTitulo.select();
            }
        }, 300);
    }
}

function abrirModalEliminarNota(id) {
    notaParaEliminarId = id;

    if (!modalEliminarNotaInstance && modalEliminarNotaEl && typeof bootstrap !== 'undefined') {
        modalEliminarNotaInstance = new bootstrap.Modal(modalEliminarNotaEl);
    }
    if (modalEliminarNotaInstance) {
        modalEliminarNotaInstance.show();
    }
}

function abrirModalEliminarTodas() {
    if (notas.length === 0) return;

    if (!modalEliminarTodasInstance && modalEliminarTodasEl && typeof bootstrap !== 'undefined') {
        modalEliminarTodasInstance = new bootstrap.Modal(modalEliminarTodasEl);
    }
    if (modalEliminarTodasInstance) {
        modalEliminarTodasInstance.show();
    }
}

function guardarContenidoNotaActual() {
    if (!notaSeleccionadaId) return;

    const nota = notas.find(n => n.id === notaSeleccionadaId);
    if (nota) {
        nota.contenido = editorQuill.getSemanticHTML();
        guardarNotasEnStorage();
    }
}

/**
 * 4.5. MODAL DE LÍMITE DE INVITADO Y ALERTAS
 */
function mostrarModalLimiteInvitado() {
    if (!modalLimiteInvitadoInstance && modalLimiteInvitadoEl && typeof bootstrap !== 'undefined') {
        modalLimiteInvitadoInstance = new bootstrap.Modal(modalLimiteInvitadoEl);
    }
    if (modalLimiteInvitadoInstance) {
        modalLimiteInvitadoInstance.show();
    }
}

function inicializarAlertas() {
    if (!alertaBienvenida) return;

    if (localStorage.getItem(STORAGE_KEYS.ALERTA_REGISTRO) === 'si') {
        const nombre = localStorage.getItem(STORAGE_KEYS.NOMBRE_USUARIO);
        const mensaje = nombre
            ? `¡Cuenta creada con éxito! Bienvenido a tu espacio, ${nombre}.`
            : `¡Cuenta creada con éxito! Bienvenido a tu espacio.`;
        mostrarMensajeAlerta(`<i class="bi bi-check-circle-fill me-2"></i> ${mensaje}`, 'alert-success');
        localStorage.removeItem(STORAGE_KEYS.ALERTA_REGISTRO);
    } else if (localStorage.getItem(STORAGE_KEYS.ALERTA_LOGIN) === 'si') {
        const nombre = localStorage.getItem(STORAGE_KEYS.NOMBRE_USUARIO);
        const mensaje = nombre
            ? `¡Iniciaste sesión con éxito! Bienvenido a tu espacio, ${nombre}.`
            : `¡Iniciaste sesión con éxito! Bienvenido a tu espacio.`;
        mostrarMensajeAlerta(`<i class="bi bi-check-circle-fill me-2"></i> ${mensaje}`, 'alert-success');
        localStorage.removeItem(STORAGE_KEYS.ALERTA_LOGIN);
    } else if (localStorage.getItem(STORAGE_KEYS.ALERTA_GOOGLE) === 'si') {
        mostrarMensajeAlerta('<i class="bi bi-google me-2"></i> ¡Iniciaste sesión con Google con éxito! Bienvenido.', 'alert-success');
        localStorage.removeItem(STORAGE_KEYS.ALERTA_GOOGLE);
    } else if (localStorage.getItem(STORAGE_KEYS.ALERTA_LOGOUT) === 'si') {
        mostrarMensajeAlerta('<i class="bi bi-info-circle-fill me-2"></i> Has cerrado sesión correctamente. Volviste al modo invitado.', 'alert-info');
        localStorage.removeItem(STORAGE_KEYS.ALERTA_LOGOUT);
    }
}

function mostrarMensajeAlerta(html, claseTipo) {
    alertaBienvenida.innerHTML = `${html} <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`;
    alertaBienvenida.className = `alert ${claseTipo} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3 shadow z-3`;
    alertaBienvenida.classList.remove('d-none');

    setTimeout(() => {
        alertaBienvenida.classList.add('d-none');
    }, 4500);
}

/* ==========================================================================
   5. EVENT LISTENERS
   ========================================================================== */

// Botón de alternar Tema Claro / Oscuro
if (btnLuna) {
    btnLuna.addEventListener('click', toggleTema);
}

// Botón del ojo para colapsar barra lateral
if (btnOjo && menuLateral && iconoOjo) {
    btnOjo.addEventListener('click', () => {
        menuLateral.classList.toggle('menu-oculto');
        iconoOjo.className = menuLateral.classList.contains('menu-oculto')
            ? 'bi bi-eye-slash'
            : 'bi bi-eye';
    });
}

// Botón "Añadir nuevo +"
if (btnAnadirNota) {
    btnAnadirNota.addEventListener('click', crearNuevaNota);
}

// Botón "Eliminar todas las notas"
if (btnEliminarTodas) {
    btnEliminarTodas.addEventListener('click', abrirModalEliminarTodas);
}

// Confirmar eliminación de todas las notas desde el modal
if (btnConfirmarEliminarTodas) {
    btnConfirmarEliminarTodas.addEventListener('click', () => {
        notas = [];
        guardarNotasEnStorage();
        renderizarListaNotas();

        if (lienzoCentral) lienzoCentral.classList.add('d-none');
        notaSeleccionadaId = null;
        editorQuill.setText('');

        if (modalEliminarTodasInstance) {
            modalEliminarTodasInstance.hide();
        }
    });
}

// Guardado automático del contenido de Quill con debounce
editorQuill.on('text-change', () => {
    clearTimeout(debounceGuardadoTimer);
    debounceGuardadoTimer = setTimeout(guardarContenidoNotaActual, 300);
});

// Guardar cambio de título desde el modal
if (formEditarTitulo) {
    formEditarTitulo.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!notaParaEditarId) return;

        const nota = notas.find(n => n.id === notaParaEditarId);
        if (nota && inputNuevoTitulo) {
            const nuevoTitulo = inputNuevoTitulo.value.trim();
            if (nuevoTitulo) {
                nota.titulo = nuevoTitulo;
                guardarNotasEnStorage();
                renderizarListaNotas();
            }
        }

        if (modalEditarTituloInstance) {
            modalEditarTituloInstance.hide();
        }
        notaParaEditarId = null;
    });
}

// Confirmar eliminación de nota individual desde el modal
if (btnConfirmarEliminar) {
    btnConfirmarEliminar.addEventListener('click', () => {
        if (!notaParaEliminarId) return;

        notas = notas.filter(n => n.id !== notaParaEliminarId);
        guardarNotasEnStorage();
        renderizarListaNotas();

        if (notas.length > 0) {
            seleccionarNota(notas[0].id);
        } else {
            if (lienzoCentral) lienzoCentral.classList.add('d-none');
            notaSeleccionadaId = null;
            editorQuill.setText('');
        }

        if (modalEliminarNotaInstance) {
            modalEliminarNotaInstance.hide();
        }
        notaParaEliminarId = null;
    });
}

// Cerrar sesión
if (opcionLogout) {
    opcionLogout.addEventListener('click', cerrarSesion);
}

// Selección de avatares en el modal
botonesAvatar.forEach(boton => {
    boton.addEventListener('click', function () {
        const nombreAvatar = this.getAttribute('data-avatar');
        cambiarAvatar(nombreAvatar);
    });
});
