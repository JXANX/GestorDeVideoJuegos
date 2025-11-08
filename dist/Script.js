import { Videojuego } from "./models/Videojuego.js";
import { Reseña } from "./models/Reseña.js";
import { Usuario } from "./models/Usuario.js";
import { VideojuegoBeta } from "./models/VideoJuegoBeta.js";
import { obtenerJuegosPopulares } from "./rawgAPI.js";
// ================== IMPORTAR LOCALSTORAGE ==================
import { inicializarDatosDefault, guardarUsuarios, guardarVideojuegos, guardarVideojuegosBeta, guardarReseñas, guardarSesion, obtenerSesion, cerrarSesionStorage, hayUsuarioLogueado, debugearEstado } from "./localStorage.js";
// ================== INICIALIZAR DATOS CON LOCALSTORAGE ==================
console.log('🚀 Iniciando aplicación...');
const datosIniciales = inicializarDatosDefault();
let listaUsuarios = datosIniciales.usuarios;
let listaVideojuegos = datosIniciales.videojuegos;
let listaVideojuegosBeta = datosIniciales.videojuegosBeta;
let listaReseñas = datosIniciales.reseñas;
// Mostrar estado actual en consola
debugearEstado();
// ================== PROTECCIÓN DE PÁGINAS ==================
// Verificar si el usuario está logueado (excepto en login.html)
if (window.location.pathname.includes('index.html') ||
    window.location.pathname.includes('videojuegos.html') ||
    window.location.pathname.includes('reseñas.html')) {
    if (!hayUsuarioLogueado()) {
        console.log('⚠️ No hay sesión activa, redirigiendo al login...');
        window.location.href = 'login.html';
    }
    else {
        const sesion = obtenerSesion();
        console.log('✅ Usuario logueado:', sesion?.nombre);
    }
}
// ================== FUNCIONES DE AUTENTICACIÓN ==================
function iniciarSesion(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    console.log('🔐 Intento de login:', email);
    console.log('📋 Usuarios disponibles:', listaUsuarios.length);
    // Buscar usuario activo con ese correo
    const usuario = listaUsuarios.find(u => {
        const coincideCorreo = u.getCorreo() === email;
        const estaActivo = u.getActivo();
        console.log(`  Verificando ${u.getCorreo()}:`, { coincideCorreo, estaActivo });
        return coincideCorreo && estaActivo;
    });
    if (!usuario) {
        console.error('❌ Usuario no encontrado o inactivo');
        const errorDiv = document.getElementById('errorMessage');
        if (errorDiv) {
            errorDiv.textContent = 'Usuario no encontrado o cuenta inactiva';
            errorDiv.style.display = 'block';
            setTimeout(() => errorDiv.style.display = 'none', 4000);
        }
        return false;
    }
    // Verificar que el usuario tiene el método iniciarSesion
    if (typeof usuario.iniciarSesion !== 'function') {
        console.error('❌ ERROR CRÍTICO: El usuario no tiene el método iniciarSesion');
        console.log('Usuario defectuoso:', usuario);
        alert('Error en la aplicación. Por favor, limpia el caché y recarga.');
        return false;
    }
    // Intentar iniciar sesión
    const loginExitoso = usuario.iniciarSesion(email, password);
    if (loginExitoso) {
        console.log('✅ Login exitoso');
        guardarSesion(usuario);
        const successDiv = document.getElementById('successMessage');
        if (successDiv) {
            successDiv.textContent = '¡Inicio de sesión exitoso! Redirigiendo...';
            successDiv.style.display = 'block';
        }
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
        return false;
    }
    else {
        console.error('❌ Contraseña incorrecta');
        const errorDiv = document.getElementById('errorMessage');
        if (errorDiv) {
            errorDiv.textContent = 'Contraseña incorrecta';
            errorDiv.style.display = 'block';
            setTimeout(() => errorDiv.style.display = 'none', 4000);
        }
        return false;
    }
}
function registrarUsuario(event) {
    event.preventDefault();
    const id = parseInt(document.getElementById('regId').value);
    const nombre = document.getElementById('regNombre').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const errorDiv = document.getElementById('errorMessage');
    const successDiv = document.getElementById('successMessage');
    // Verificar si el ID o email ya existen
    if (listaUsuarios.some(u => u.getIdUsuario() === id)) {
        if (errorDiv) {
            errorDiv.textContent = 'El ID de usuario ya existe';
            errorDiv.style.display = 'block';
            setTimeout(() => errorDiv.style.display = 'none', 4000);
        }
        return false;
    }
    if (listaUsuarios.some(u => u.getCorreo() === email)) {
        if (errorDiv) {
            errorDiv.textContent = 'El correo electrónico ya está registrado';
            errorDiv.style.display = 'block';
            setTimeout(() => errorDiv.style.display = 'none', 4000);
        }
        return false;
    }
    // Crear nuevo usuario
    const nuevoUsuario = new Usuario(id, nombre, email, password, true);
    listaUsuarios.push(nuevoUsuario);
    // 🔥 GUARDAR EN LOCALSTORAGE
    guardarUsuarios(listaUsuarios);
    if (successDiv) {
        successDiv.textContent = '¡Usuario registrado exitosamente! Ya puedes iniciar sesión';
        successDiv.style.display = 'block';
        setTimeout(() => successDiv.style.display = 'none', 4000);
    }
    // Limpiar formulario
    document.getElementById('regId').value = '';
    document.getElementById('regNombre').value = '';
    document.getElementById('regEmail').value = '';
    document.getElementById('regPassword').value = '';
    // Cerrar el formulario de registro
    const registerSection = document.getElementById('registerSection');
    const toggleBtn = document.getElementById('toggleBtn');
    if (registerSection)
        registerSection.classList.remove('active');
    if (toggleBtn)
        toggleBtn.textContent = 'Crear Nueva Cuenta';
    return false;
}
function cerrarSesion() {
    // 🔥 CERRAR SESIÓN EN LOCALSTORAGE
    cerrarSesionStorage();
    window.location.href = 'login.html';
}
// ================== INTERFAZ - VIDEOJUEGOS ==================
function mostrarJuegos(juegos, contenedorId) {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor)
        return;
    if (!juegos || juegos.length === 0) {
        contenedor.innerHTML = '<div class="no-results">No se encontraron juegos.</div>';
        return;
    }
    contenedor.innerHTML = juegos.map(juego => `
        <div class="game-card">
            <h4>${juego.getTítulo()}</h4>
            <div class="game-info">
                <div class="info-item"><span class="info-label">ID:</span> ${juego.getId()}</div>
                <div class="info-item"><span class="info-label">Género:</span> ${juego.getGenero()}</div>
                <div class="info-item"><span class="info-label">Desarrollador:</span> ${juego.getDesarrollador()}</div>
                <div class="info-item"><span class="info-label">Año:</span> ${juego.getAñoLanzamiento()}</div>
                <div class="info-item"><span class="info-label">Plataforma:</span> ${juego.getPlataforma()}</div>
                <div class="info-item"><span class="info-label">Estado:</span> ${juego.getEstado()}</div>
                <div class="info-item price"><span class="info-label">Precio:</span> $${juego.getPrecio().toLocaleString()}</div>
                <div class="info-item rating"><span class="info-label">Rating:</span> ${juego.getRating()}</div>
            </div>
            <div class="info-item" style="margin-top: 10px;"><span class="info-label">Descripción:</span> ${juego.getDescripcion()}</div>
        </div>
    `).join("");
}
// ================== INTERFAZ - VIDEOJUEGOS BETA ==================
function mostrarJuegosBeta(juegos, contenedorId) {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor)
        return;
    if (!juegos || juegos.length === 0) {
        contenedor.innerHTML = '<div class="no-results">No se encontraron juegos beta.</div>';
        return;
    }
    contenedor.innerHTML = juegos.map(juego => {
        const feedback = juego.obtenerFeedback();
        const feedbackHTML = feedback.length > 0
            ? `<div class="feedback-section">
                <strong>Feedback de usuarios:</strong>
                <ul>${feedback.map(f => `<li>${f}</li>`).join('')}</ul>
               </div>`
            : '';
        return `
        <div class="game-card beta-card">
            <div class="beta-badge">BETA</div>
            <h4>${juego.getTítulo()}</h4>
            <div class="game-info">
                <div class="info-item"><span class="info-label">ID:</span> ${juego.getId()}</div>
                <div class="info-item"><span class="info-label">Versión:</span> ${juego.getVersion()}</div>
                <div class="info-item"><span class="info-label">Fecha Acceso:</span> ${juego.getFechaAcceso()}</div>
                <div class="info-item"><span class="info-label">Género:</span> ${juego.getGenero()}</div>
                <div class="info-item"><span class="info-label">Desarrollador:</span> ${juego.getDesarrollador()}</div>
                <div class="info-item"><span class="info-label">Año:</span> ${juego.getAñoLanzamiento()}</div>
                <div class="info-item"><span class="info-label">Plataforma:</span> ${juego.getPlataforma()}</div>
                <div class="info-item rating"><span class="info-label">Rating:</span> ${juego.getRating()}</div>
            </div>
            <div class="info-item" style="margin-top: 10px;"><span class="info-label">Descripción:</span> ${juego.getDescripcion()}</div>
            ${feedbackHTML}
        </div>
    `;
    }).join("");
}
// ================== INTERFAZ - RESEÑAS ==================
function mostrarReseñas(reseñas, contenedorId) {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor)
        return;
    if (!reseñas || reseñas.length === 0) {
        contenedor.innerHTML = '<div class="no-results">No se encontraron reseñas.</div>';
        return;
    }
    contenedor.innerHTML = reseñas.map(r => `
        <div class="review-card">
            <h4>Reseña de ${r.getUsuario()}</h4>
            <div class="review-info">
                <div class="info-item"><span class="info-label">ID:</span> ${r.getIdReseña()}</div>
                <div class="info-item rating"><span class="info-label">Calificación:</span> ${r.getCalificacion()}</div>
                <div class="info-item"><span class="info-label">Fecha:</span> ${r.getFecha()}</div>
            </div>
            <div class="info-item" style="margin-top: 10px;"><span class="info-label">Comentario:</span> ${r.getComentario()}</div>
        </div>
    `).join("");
}
// ================== CRUD VIDEOJUEGOS ==================
function agregarVideojuego(nuevoJuego) {
    listaVideojuegos.push(nuevoJuego);
    // 🔥 GUARDAR EN LOCALSTORAGE
    guardarVideojuegos(listaVideojuegos);
}
function obtenerAllVideojuegos() {
    return listaVideojuegos.filter(j => j.getActivo());
}
function obtenerVideojuegoPorID(id) {
    return listaVideojuegos.find(j => j.getId() === id && j.getActivo()) || null;
}
function eliminarVideojuego(id) {
    const juego = listaVideojuegos.find(j => j.getId() === id && j.getActivo());
    if (juego) {
        juego.setActivo(false);
        // 🔥 GUARDAR EN LOCALSTORAGE
        guardarVideojuegos(listaVideojuegos);
    }
}
// ================== CRUD VIDEOJUEGOS BETA ==================
function agregarVideojuegoBeta(nuevoJuego) {
    listaVideojuegosBeta.push(nuevoJuego);
    // 🔥 GUARDAR EN LOCALSTORAGE
    guardarVideojuegosBeta(listaVideojuegosBeta);
}
function obtenerAllVideojuegosBeta() {
    return listaVideojuegosBeta.filter(j => j.getActivo());
}
function obtenerVideojuegoBetaPorID(id) {
    return listaVideojuegosBeta.find(j => j.getId() === id && j.getActivo()) || null;
}
function eliminarVideojuegoBeta(id) {
    const juego = listaVideojuegosBeta.find(j => j.getId() === id && j.getActivo());
    if (juego) {
        juego.setActivo(false);
        // 🔥 GUARDAR EN LOCALSTORAGE
        guardarVideojuegosBeta(listaVideojuegosBeta);
    }
}
// ================== CRUD RESEÑAS ==================
function agregarReseña(nuevaReseña) {
    listaReseñas.push(nuevaReseña);
    // 🔥 GUARDAR EN LOCALSTORAGE
    guardarReseñas(listaReseñas);
}
function actualizarReseña(id, datosActualizados) {
    const r = listaReseñas.find(r => r.getIdReseña() === id && r.getActivo());
    if (r) {
        Object.assign(r, datosActualizados);
        // 🔥 GUARDAR EN LOCALSTORAGE
        guardarReseñas(listaReseñas);
    }
}
function eliminarReseña(id) {
    const r = listaReseñas.find(r => r.getIdReseña() === id && r.getActivo());
    if (r) {
        r.setActivo(false);
        // 🔥 GUARDAR EN LOCALSTORAGE
        guardarReseñas(listaReseñas);
    }
}
// ================== FUNCIONES VINCULADAS A BOTONES - VIDEOJUEGOS ==================
function mostrarTodosLosJuegos() {
    mostrarJuegos(obtenerAllVideojuegos(), "todosJuegos");
}
function agregarNuevoJuego() {
    const Id = parseInt(document.getElementById('nuevoId').value);
    const título = document.getElementById('nuevoTitulo').value;
    const genero = document.getElementById('nuevoGenero').value;
    const desarrollador = document.getElementById('nuevoDesarrollador').value;
    const añoLanzamiento = parseInt(document.getElementById('nuevoAño').value);
    const plataforma = document.getElementById('nuevaPlataforma').value;
    const descripcion = document.getElementById('nuevaDescripcion').value;
    const precio = parseInt(document.getElementById('nuevoPrecio').value);
    const estado = document.getElementById('nuevoEstado').value;
    const rating = parseFloat(document.getElementById('nuevoRating').value);
    const nuevoJuego = new Videojuego(Id, título, genero, desarrollador, añoLanzamiento, plataforma, descripcion, precio, estado, rating, true);
    agregarVideojuego(nuevoJuego);
    alert("Juego agregado y guardado en LocalStorage!");
}
function buscarPorId() {
    const id = parseInt(document.getElementById('buscarId').value);
    const juego = obtenerVideojuegoPorID(id);
    if (juego) {
        mostrarJuegos([juego], "resultadoBusqueda");
    }
    else {
        document.getElementById("resultadoBusqueda").innerHTML = "<div class='no-results'>No se encontró el juego</div>";
    }
}
function buscarPorGenero() {
    const genero = document.getElementById('buscarGenero').value.toLowerCase();
    const juegos = listaVideojuegos.filter(j => j.getGenero().toLowerCase().includes(genero) && j.getActivo());
    mostrarJuegos(juegos, "resultadoGenero");
}
function actualizarJuego() {
    const id = parseInt(document.getElementById('actualizarId').value);
    const juego = listaVideojuegos.find(j => j.getId() === id && j.getActivo());
    if (juego) {
        const titulo = document.getElementById('actualizarTitulo').value;
        if (titulo)
            juego.setTítulo(titulo);
        const genero = document.getElementById('actualizarGenero').value;
        if (genero)
            juego.setGenero(genero);
        const desarrollador = document.getElementById('actualizarDesarrollador').value;
        if (desarrollador)
            juego.setDesarrollador(desarrollador);
        const precio = document.getElementById('actualizarPrecio').value;
        if (precio)
            juego.setPrecio(parseInt(precio));
        const rating = document.getElementById('actualizarRating').value;
        if (rating)
            juego.setRating(parseFloat(rating));
        // 🔥 GUARDAR EN LOCALSTORAGE
        guardarVideojuegos(listaVideojuegos);
        mostrarJuegos([juego], "resultadoActualizacion");
        alert("Juego actualizado y guardado!");
    }
    else {
        document.getElementById("resultadoActualizacion").innerHTML = "<div class='no-results'>No se encontró el videojuego con ese ID</div>";
    }
}
function eliminarJuego() {
    const id = parseInt(document.getElementById('eliminarId').value);
    eliminarVideojuego(id);
    alert("Juego eliminado!");
}
// ================== FUNCIONES VINCULADAS A BOTONES - VIDEOJUEGOS BETA ==================
function mostrarTodosLosJuegosBeta() {
    mostrarJuegosBeta(obtenerAllVideojuegosBeta(), "todosJuegosBeta");
}
function agregarNuevoJuegoBeta() {
    const Id = parseInt(document.getElementById('nuevoBetaId').value);
    const título = document.getElementById('nuevoBetaTitulo').value;
    const genero = document.getElementById('nuevoBetaGenero').value;
    const desarrollador = document.getElementById('nuevoBetaDesarrollador').value;
    const añoLanzamiento = parseInt(document.getElementById('nuevoBetaAño').value);
    const plataforma = document.getElementById('nuevoBetaPlataforma').value;
    const descripcion = document.getElementById('nuevoBetaDescripcion').value;
    const rating = parseFloat(document.getElementById('nuevoBetaRating').value);
    const fechaAcceso = document.getElementById('nuevoBetaFecha').value;
    const version = document.getElementById('nuevoBetaVersion').value;
    const nuevoJuegoBeta = new VideojuegoBeta(Id, título, genero, desarrollador, añoLanzamiento, plataforma, descripcion, 0, "Beta", rating, true, fechaAcceso, version);
    agregarVideojuegoBeta(nuevoJuegoBeta);
    alert("Juego Beta agregado y guardado!");
}
function buscarBetaPorId() {
    const id = parseInt(document.getElementById('buscarBetaId').value);
    const juego = obtenerVideojuegoBetaPorID(id);
    if (juego) {
        mostrarJuegosBeta([juego], "resultadoBusquedaBeta");
    }
    else {
        document.getElementById("resultadoBusquedaBeta").innerHTML = "<div class='no-results'>No se encontró el juego beta</div>";
    }
}
function agregarFeedbackBeta() {
    const id = parseInt(document.getElementById('feedbackBetaId').value);
    const feedback = document.getElementById('feedbackTexto').value;
    const juego = obtenerVideojuegoBetaPorID(id);
    if (juego && feedback) {
        juego.agregarFeedback(feedback);
        // 🔥 GUARDAR EN LOCALSTORAGE
        guardarVideojuegosBeta(listaVideojuegosBeta);
        alert("Feedback agregado y guardado exitosamente!");
        document.getElementById('feedbackTexto').value = '';
        mostrarJuegosBeta([juego], "resultadoFeedback");
    }
    else {
        alert("No se encontró el juego o el feedback está vacío");
    }
}
function actualizarJuegoBeta() {
    const id = parseInt(document.getElementById('actualizarBetaId').value);
    const juego = listaVideojuegosBeta.find(j => j.getId() === id && j.getActivo());
    if (juego) {
        const titulo = document.getElementById('actualizarBetaTitulo').value;
        if (titulo)
            juego.setTítulo(titulo);
        const version = document.getElementById('actualizarBetaVersion').value;
        if (version)
            juego.setVersion(version);
        const rating = document.getElementById('actualizarBetaRating').value;
        if (rating)
            juego.setRating(parseFloat(rating));
        // 🔥 GUARDAR EN LOCALSTORAGE
        guardarVideojuegosBeta(listaVideojuegosBeta);
        mostrarJuegosBeta([juego], "resultadoActualizacionBeta");
        alert("Juego Beta actualizado y guardado!");
    }
    else {
        document.getElementById("resultadoActualizacionBeta").innerHTML = "<div class='no-results'>No se encontró el videojuego beta con ese ID</div>";
    }
}
function eliminarJuegoBeta() {
    const id = parseInt(document.getElementById('eliminarBetaId').value);
    eliminarVideojuegoBeta(id);
    alert("Juego Beta eliminado!");
}
// ================== FUNCIONES VINCULADAS A BOTONES - RESEÑAS ==================
function buscarReseñaPorId() {
    const id = parseInt(document.getElementById('buscarReseñaId').value);
    const reseña = listaReseñas.find(r => r.getIdReseña() === id && r.getActivo());
    if (reseña) {
        mostrarReseñas([reseña], "resultadoBusquedaReseña");
    }
    else {
        document.getElementById("resultadoBusquedaReseña").innerHTML = "<div class='no-results'>No se encontró la reseña</div>";
    }
}
function filtrarPorCalificacion() {
    const calificacionMinima = parseFloat(document.getElementById('filtroCalificacion').value);
    const reseñasFiltradas = listaReseñas.filter(r => r.getCalificacion() >= calificacionMinima && r.getActivo());
    mostrarReseñas(reseñasFiltradas, "resultadoFiltroCalificacion");
}
function agregarNuevaReseña() {
    const idReseña = parseInt(document.getElementById('nuevaReseñaId').value);
    const usuario = document.getElementById('nuevoUsuario').value;
    const comentario = document.getElementById('nuevoComentario').value;
    const calificación = parseFloat(document.getElementById('nuevaCalificacion').value);
    const fecha = document.getElementById('nuevaFecha').value;
    const nuevaReseña = new Reseña(idReseña, usuario, comentario, calificación, fecha, true);
    agregarReseña(nuevaReseña);
    alert("Reseña agregada y guardada!");
}
function mostrarTodasLasReseñas() {
    mostrarReseñas(listaReseñas.filter(r => r.getActivo()), "todasReseñas");
}
function actualizarReseñaCompleta() {
    const id = parseInt(document.getElementById('actualizarReseñaId').value);
    const reseña = listaReseñas.find(r => r.getIdReseña() === id && r.getActivo());
    if (reseña) {
        const usuario = document.getElementById('actualizarUsuario').value;
        if (usuario)
            reseña.setUsuario(usuario);
        const comentario = document.getElementById('actualizarComentario').value;
        if (comentario)
            reseña.setComentario(comentario);
        const calificacion = document.getElementById('actualizarCalificacion').value;
        if (calificacion)
            reseña.setCalificacion(parseFloat(calificacion));
        // 🔥 GUARDAR EN LOCALSTORAGE
        guardarReseñas(listaReseñas);
        alert("Reseña actualizada y guardada!");
    }
    else {
        alert("No se encontró la reseña con ese ID");
    }
}
function eliminarReseñaCompleta() {
    const id = parseInt(document.getElementById('eliminarReseñaId').value);
    eliminarReseña(id);
    alert("Reseña eliminada!");
}
// ================== FUNCIONES PARA RAWG Y CHEAPSHARK API ==================
import { buscarJuego, buscarJuegoPorGenero } from "./rawgAPI.js";
import { buscarJuegoPorNombre, obtenerDetallesJuego, obtenerMejoresOfertas, TIENDAS_CHEAPSHARK } from "./cheapshark.js";
function renderizarJuegoRAWG(juego) {
    const generos = juego.genres.map(g => g.name).join(', ') || 'No disponible';
    const plataformas = juego.platforms?.slice(0, 3).map(p => p.platform.name).join(', ') || 'No disponible';
    return `
        <div class="game-card" style="border-left-color: #3182ce;">
            <div style="display: flex; gap: 15px; align-items: start; flex-wrap: wrap;">
                ${juego.background_image ? `
                    <img src="${juego.background_image}" alt="${juego.name}" 
                         style="width: 150px; height: 150px; object-fit: cover; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                ` : ''}
                <div style="flex: 1; min-width: 250px;">
                    <h4 style="color: #3182ce; margin-bottom: 10px;">🌐 ${juego.name}</h4>
                    <div class="game-info">
                        <div class="info-item">
                            <span class="info-label">ID API:</span> ${juego.id}
                        </div>
                        <div class="info-item">
                            <span class="info-label">Géneros:</span> ${generos}
                        </div>
                        <div class="info-item">
                            <span class="info-label">Lanzamiento:</span> ${juego.released || 'TBA'}
                        </div>
                        <div class="info-item">
                            <span class="info-label">Plataformas:</span> ${plataformas}
                        </div>
                        <div class="info-item">
                            <span class="info-label">Rating RAWG:</span> 
                            <span class="rating">⭐ ${juego.rating}/5</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}
async function buscarPorGeneroMejorado() {
    const genero = document.getElementById('buscarGenero').value;
    const container = document.getElementById('resultadoGenero');
    if (!genero) {
        alert('Por favor ingresa un género');
        return;
    }
    container.innerHTML = '<p style="text-align: center; padding: 20px;">🔍 Buscando en base de datos local y RAWG API...</p>';
    try {
        const juegosLocales = listaVideojuegos.filter(j => j.getGenero().toLowerCase().includes(genero.toLowerCase()) && j.getActivo());
        const juegosAPI = await buscarJuegoPorGenero(genero);
        let html = '';
        if (juegosLocales.length > 0) {
            html += '<div style="margin-bottom: 30px;">';
            html += '<h3 style="color: #2d3748; margin-bottom: 15px; padding: 10px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px;">📚 Juegos en tu Colección Local</h3>';
            html += juegosLocales.map(j => {
                const cardHTML = `
                    <div class="game-card">
                        <h4>${j.getTítulo()}</h4>
                        <div class="game-info">
                            <div class="info-item"><span class="info-label">ID:</span> ${j.getId()}</div>
                            <div class="info-item"><span class="info-label">Género:</span> ${j.getGenero()}</div>
                            <div class="info-item"><span class="info-label">Desarrollador:</span> ${j.getDesarrollador()}</div>
                            <div class="info-item"><span class="info-label">Año:</span> ${j.getAñoLanzamiento()}</div>
                            <div class="info-item"><span class="info-label">Plataforma:</span> ${j.getPlataforma()}</div>
                            <div class="info-item price"><span class="info-label">Precio:</span> ${j.getPrecio().toLocaleString()}</div>
                            <div class="info-item rating"><span class="info-label">Rating:</span> ${j.getRating()}</div>
                        </div>
                        <div class="info-item" style="margin-top: 10px;"><span class="info-label">Descripción:</span> ${j.getDescripcion()}</div>
                    </div>
                `;
                return cardHTML;
            }).join('');
            html += '</div>';
        }
        if (juegosAPI.length > 0) {
            html += '<div style="margin-bottom: 20px;">';
            html += '<h3 style="color: #3182ce; margin-bottom: 15px; padding: 10px; background: linear-gradient(135deg, #3182ce 0%, #2c5282 100%); color: white; border-radius: 8px;">🌐 Juegos desde RAWG API</h3>';
            html += `<p style="color: #4a5568; margin-bottom: 15px; font-style: italic;">Se encontraron ${juegosAPI.length} juegos del género "${genero}"</p>`;
            html += juegosAPI.slice(0, 15).map(j => renderizarJuegoRAWG(j)).join('');
            html += '</div>';
        }
        if (juegosLocales.length === 0 && juegosAPI.length === 0) {
            html = `
                <div class="no-results">
                    <p>❌ No se encontraron juegos del género "${genero}" ni en tu colección ni en RAWG</p>
                    <p style="margin-top: 10px; color: #718096;">Intenta con otros géneros como: Action, Adventure, RPG, Strategy, Indie, etc.</p>
                </div>
            `;
        }
        container.innerHTML = html;
    }
    catch (error) {
        console.error('Error al buscar juegos:', error);
        container.innerHTML = `
            <div class="no-results">
                <p>❌ Error al buscar juegos. Por favor intenta de nuevo.</p>
            </div>
        `;
    }
}
async function buscarJuegoEnRAWG() {
    const nombre = document.getElementById('buscarNombreRAWG').value;
    const container = document.getElementById('resultadoRAWG');
    if (!nombre) {
        alert('Por favor ingresa el nombre de un juego');
        return;
    }
    container.innerHTML = '<p style="text-align: center; padding: 20px;">🔍 Buscando en RAWG API...</p>';
    try {
        const juegos = await buscarJuego(nombre);
        if (juegos.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <p>❌ No se encontraron juegos con el nombre "${nombre}"</p>
                </div>
            `;
            return;
        }
        let html = `
            <h3 style="color: #3182ce; margin-bottom: 15px;">
                🎮 Resultados para "${nombre}" (${juegos.length} encontrados)
            </h3>
        `;
        html += juegos.slice(0, 10).map(j => renderizarJuegoRAWG(j)).join('');
        container.innerHTML = html;
    }
    catch (error) {
        console.error('Error al buscar en RAWG:', error);
        container.innerHTML = `
            <div class="no-results">
                <p>❌ Error al buscar en RAWG. Por favor intenta de nuevo.</p>
            </div>
        `;
    }
}
async function mostrarJuegosPopularesRAWG() {
    const container = document.getElementById('juegosPopularesRAWG');
    container.innerHTML = '<p style="text-align: center; padding: 20px;">🔄 Cargando juegos populares desde RAWG...</p>';
    try {
        const juegos = await obtenerJuegosPopulares();
        if (juegos.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <p>❌ No se pudieron cargar los juegos populares</p>
                </div>
            `;
            return;
        }
        let html = `
            <h3 style="color: #3182ce; margin-bottom: 15px;">
                🌟 Top ${juegos.length} Juegos Mejor Valorados en RAWG
            </h3>
        `;
        html += juegos.map(j => renderizarJuegoRAWG(j)).join('');
        container.innerHTML = html;
    }
    catch (error) {
        console.error('Error al cargar juegos populares:', error);
        container.innerHTML = `
            <div class="no-results">
                <p>❌ Error al cargar juegos populares. Por favor intenta de nuevo.</p>
            </div>
        `;
    }
}
function renderizarJuegoCheapShark(juego) {
    const precioMasBarato = parseFloat(juego.cheapest);
    const descuento = precioMasBarato === 0 ? "GRATIS" : `${precioMasBarato.toFixed(2)} USD`;
    return `
      <div class="game-card" style="border-left-color: #10b981;">
        <div style="display: flex; gap: 15px; align-items: start; flex-wrap: wrap;">
          ${juego.thumb ? `
            <img src="${juego.thumb}" alt="${juego.external}" 
                 style="width: 150px; height: 70px; object-fit: cover; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          ` : ''}
          <div style="flex: 1; min-width: 250px;">
            <h4 style="color: #10b981; margin-bottom: 10px;">💰 ${juego.external}</h4>
            <div class="game-info">
              <div class="info-item">
                <span class="info-label">Precio más barato:</span> 
                <span class="price">${descuento}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Steam ID:</span> ${juego.steamAppID || 'N/A'}
              </div>
              <div class="info-item">
                <button onclick="verDetallesOferta('${juego.gameID}')" 
                        class="btn-info" 
                        style="padding: 8px 15px; font-size: 12px;">
                  🔍 Ver Ofertas
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
}
async function buscarPreciosEnCheapShark() {
    const nombre = document.getElementById('buscarPrecioCheapShark').value;
    const container = document.getElementById('resultadoCheapShark');
    if (!nombre) {
        alert('Por favor ingresa el nombre de un juego');
        return;
    }
    container.innerHTML = '<p style="text-align: center; padding: 20px;">💰 Buscando precios en CheapShark...</p>';
    try {
        const juegos = await buscarJuegoPorNombre(nombre);
        if (juegos.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <p>❌ No se encontraron precios para "${nombre}"</p>
                </div>
            `;
            return;
        }
        let html = `
            <h3 style="color: #10b981; margin-bottom: 15px;">
                💵 Precios encontrados para "${nombre}" (${juegos.length} resultados)
            </h3>
        `;
        html += juegos.map(j => renderizarJuegoCheapShark(j)).join('');
        container.innerHTML = html;
    }
    catch (error) {
        console.error('Error al buscar en CheapShark:', error);
        container.innerHTML = `
            <div class="no-results">
                <p>❌ Error al buscar precios. Por favor intenta de nuevo.</p>
            </div>
        `;
    }
}
async function verDetallesOferta(gameID) {
    const container = document.getElementById('detallesOferta');
    container.innerHTML = '<p style="text-align: center; padding: 20px;">🔍 Cargando ofertas...</p>';
    container.scrollIntoView({ behavior: 'smooth' });
    try {
        const detalles = await obtenerDetallesJuego(gameID);
        if (!detalles) {
            container.innerHTML = '<div class="no-results">❌ No se pudieron cargar las ofertas</div>';
            return;
        }
        let html = `
            <div style="background: white; padding: 20px; border-radius: 10px; margin-top: 20px;">
                <h3 style="color: #10b981; margin-bottom: 15px;">🎮 ${detalles.info.title}</h3>
                <img src="${detalles.info.thumb}" style="max-width: 300px; border-radius: 8px; margin-bottom: 15px;">
                <p style="margin-bottom: 20px;"><strong>Precio más bajo histórico:</strong> 
                    <span class="price">${detalles.cheapestPriceEver.price}</span>
                    (${new Date(detalles.cheapestPriceEver.date * 1000).toLocaleDateString()})
                </p>
                <h4 style="color: #2d3748; margin-bottom: 10px;">Ofertas actuales:</h4>
                <div style="display: grid; gap: 10px;">
        `;
        detalles.deals.forEach(deal => {
            const tienda = TIENDAS_CHEAPSHARK[deal.storeID] || `Tienda ${deal.storeID}`;
            const ahorro = parseFloat(deal.savings).toFixed(0);
            html += `
                <div style="background: #f7fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981;">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                        <div>
                            <strong style="color: #2d3748;">${tienda}</strong>
                            <p style="margin-top: 5px;">
                                <span style="text-decoration: line-through; color: #718096;">${deal.retailPrice}</span>
                                <span style="color: #10b981; font-size: 1.2em; font-weight: bold; margin-left: 10px;">${deal.price}</span>
                                <span style="background: #10b981; color: white; padding: 2px 8px; border-radius: 5px; margin-left: 10px; font-size: 0.9em;">
                                    -${ahorro}%
                                </span>
                            </p>
                        </div>
                        <a href="https://www.cheapshark.com/redirect?dealID=${deal.dealID}" 
                           target="_blank" 
                           class="btn-success" 
                           style="padding: 10px 20px; text-decoration: none; font-size: 14px;">
                            🛒 Ir a la oferta
                        </a>
                    </div>
                </div>
            `;
        });
        html += `</div></div>`;
        container.innerHTML = html;
    }
    catch (error) {
        console.error('Error al cargar detalles:', error);
        container.innerHTML = '<div class="no-results">❌ Error al cargar ofertas</div>';
    }
}
async function mostrarMejoresOfertas() {
    const container = document.getElementById('mejoresOfertas');
    container.innerHTML = '<p style="text-align: center; padding: 20px;">🔥 Cargando mejores ofertas...</p>';
    try {
        const ofertas = await obtenerMejoresOfertas(15);
        if (ofertas.length === 0) {
            container.innerHTML = '<div class="no-results">❌ No se pudieron cargar las ofertas</div>';
            return;
        }
        let html = '<h3 style="color: #10b981; margin-bottom: 15px;">🔥 Top Ofertas del Momento</h3>';
        ofertas.forEach(oferta => {
            const tienda = TIENDAS_CHEAPSHARK[oferta.storeID] || `Tienda ${oferta.storeID}`;
            const ahorro = parseFloat(oferta.savings).toFixed(0);
            html += `
                <div class="game-card" style="border-left-color: #f59e0b;">
                    <div style="display: flex; gap: 15px; align-items: start; flex-wrap: wrap;">
                        <img src="${oferta.thumb}" style="width: 150px; height: 70px; object-fit: cover; border-radius: 8px;">
                        <div style="flex: 1;">
                            <h4 style="color: #f59e0b;">${oferta.title}</h4>
                            <div style="margin-top: 10px;">
                                <p><strong>Tienda:</strong> ${tienda}</p>
                                <p style="margin-top: 5px;">
                                    <span style="text-decoration: line-through; color: #718096;">${oferta.normalPrice}</span>
                                    <span style="color: #10b981; font-size: 1.3em; font-weight: bold; margin-left: 10px;">${oferta.salePrice}</span>
                                    <span style="background: #ef4444; color: white; padding: 4px 12px; border-radius: 20px; margin-left: 10px;">
                                        🔥 -${ahorro}%
                                    </span>
                                </p>
                                <a href="https://www.cheapshark.com/redirect?dealID=${oferta.dealID}" 
                                   target="_blank" 
                                   class="btn-success" 
                                   style="margin-top: 10px; display: inline-block; text-decoration: none;">
                                    🛒 Ver Oferta
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    }
    catch (error) {
        console.error('Error:', error);
        container.innerHTML = '<div class="no-results">❌ Error al cargar ofertas</div>';
    }
}
// ================== EXPONER FUNCIONES AL HTML ==================
window.iniciarSesion = iniciarSesion;
window.registrarUsuario = registrarUsuario;
window.cerrarSesion = cerrarSesion;
window.mostrarTodosLosJuegos = mostrarTodosLosJuegos;
window.agregarNuevoJuego = agregarNuevoJuego;
window.buscarPorId = buscarPorId;
window.buscarPorGenero = buscarPorGenero;
window.actualizarJuego = actualizarJuego;
window.eliminarJuego = eliminarJuego;
window.mostrarTodosLosJuegosBeta = mostrarTodosLosJuegosBeta;
window.agregarNuevoJuegoBeta = agregarNuevoJuegoBeta;
window.buscarBetaPorId = buscarBetaPorId;
window.agregarFeedbackBeta = agregarFeedbackBeta;
window.actualizarJuegoBeta = actualizarJuegoBeta;
window.eliminarJuegoBeta = eliminarJuegoBeta;
window.buscarReseñaPorId = buscarReseñaPorId;
window.filtrarPorCalificacion = filtrarPorCalificacion;
window.agregarNuevaReseña = agregarNuevaReseña;
window.mostrarTodasLasReseñas = mostrarTodasLasReseñas;
window.actualizarReseñaCompleta = actualizarReseñaCompleta;
window.eliminarReseñaCompleta = eliminarReseñaCompleta;
window.buscarPorGeneroMejorado = buscarPorGeneroMejorado;
window.buscarJuegoEnRAWG = buscarJuegoEnRAWG;
window.mostrarJuegosPopularesRAWG = mostrarJuegosPopularesRAWG;
window.buscarPreciosEnCheapShark = buscarPreciosEnCheapShark;
window.verDetallesOferta = verDetallesOferta;
window.mostrarMejoresOfertas = mostrarMejoresOfertas;
//# sourceMappingURL=Script.js.map