import { Videojuego } from "./models/Videojuego.js";
import { Reseña } from "./models/Reseña.js";
import { Usuario } from "./models/Usuario.js";
import { VideojuegoBeta } from "./models/VideoJuegoBeta.js";
import { obtenerJuegosPopulares } from "./rawgAPI.js";

// ================== IMPORTAR LOCALSTORAGE ==================
import {
    inicializarDatosDefault,
    guardarUsuarios,
    guardarVideojuegos,
    guardarVideojuegosBeta,
    guardarReseñas,
    obtenerEstadisticas,
    debugearEstado
} from "./localStorage.js";

// ================== IMPORTAR FUNCIONES DE SESSION ==================
import {
    guardarSesion,
    obtenerSesion,
    cerrarSesion as cerrarSesionGuard,
    hayUsuarioLogueado
} from "./sessionGuard.js";

// ================== INICIALIZAR DATOS CON LOCALSTORAGE ==================
console.log('🚀 Iniciando aplicación...');

const datosIniciales = inicializarDatosDefault();
let listaUsuarios: Usuario[] = datosIniciales.usuarios;
let listaVideojuegos: Videojuego[] = datosIniciales.videojuegos;
let listaVideojuegosBeta: VideojuegoBeta[] = datosIniciales.videojuegosBeta;
let listaReseñas: Reseña[] = datosIniciales.reseñas;

// Mostrar estado actual en consola
debugearEstado();

// ================== PROTECCIÓN DE PÁGINAS - CORREGIDO ==================
const paginaActual = window.location.pathname.split('/').pop() || 'index.html';
const paginasPublicas = ['login.html', 'registro.html'];

// Solo verificar sesión si NO estamos en páginas públicas
const esPaginaPublica = paginasPublicas.some(pagina => paginaActual.includes(pagina));

if (!esPaginaPublica) {
    if (!hayUsuarioLogueado()) {
        console.log('⚠️ No hay sesión activa, redirigiendo al login...');
        window.location.replace('login.html');
    } else {
        const sesion = obtenerSesion();
        console.log('✅ Usuario logueado:', sesion?.nombre);
    }
} else {
    console.log('📄 Página pública detectada:', paginaActual);
}

// ================== FUNCIONES DE AUTENTICACIÓN ==================
function iniciarSesion(event: Event): boolean {
    event.preventDefault();
    
    const emailInput = document.getElementById('loginEmail') as HTMLInputElement;
    const passwordInput = document.getElementById('loginPassword') as HTMLInputElement;
    
    if (!emailInput || !passwordInput) {
        console.error('❌ Elementos del formulario no encontrados');
        return false;
    }
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    console.log('🔍 Intento de login:', email);
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
        alert('Error en la aplicación. Por favor, limpia el caché del navegador (Ctrl+Shift+Delete) y recarga.');
        return false;
    }
    
    // Intentar iniciar sesión
    const loginExitoso = usuario.iniciarSesion(email, password);
    
    if (loginExitoso) {
        console.log('✅ Login exitoso');
        
        // Guardar sesión
        guardarSesion(usuario);
        
        const successDiv = document.getElementById('successMessage');
        if (successDiv) {
            successDiv.textContent = '¡Inicio de sesión exitoso! Redirigiendo...';
            successDiv.style.display = 'block';
        }
        
        setTimeout(() => {
            window.location.replace('index.html');
        }, 1000);
        return false;
    } else {
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

function registrarUsuario(event: Event): boolean {
    event.preventDefault();
    
    const idInput = document.getElementById('regId') as HTMLInputElement;
    const nombreInput = document.getElementById('regNombre') as HTMLInputElement;
    const emailInput = document.getElementById('regEmail') as HTMLInputElement;
    const passwordInput = document.getElementById('regPassword') as HTMLInputElement;
    
    if (!idInput || !nombreInput || !emailInput || !passwordInput) {
        console.error('❌ Elementos del formulario no encontrados');
        return false;
    }
    
    const id = parseInt(idInput.value);
    const nombre = nombreInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    const errorDiv = document.getElementById('errorMessage');
    const successDiv = document.getElementById('successMessage');
    
    // Validaciones
    if (isNaN(id) || id <= 0) {
        if (errorDiv) {
            errorDiv.textContent = 'El ID debe ser un número positivo';
            errorDiv.style.display = 'block';
            setTimeout(() => errorDiv.style.display = 'none', 4000);
        }
        return false;
    }
    
    if (!nombre || !email || !password) {
        if (errorDiv) {
            errorDiv.textContent = 'Todos los campos son obligatorios';
            errorDiv.style.display = 'block';
            setTimeout(() => errorDiv.style.display = 'none', 4000);
        }
        return false;
    }
    
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
    
    // Guardar en LocalStorage
    guardarUsuarios(listaUsuarios);
    
    if (successDiv) {
        successDiv.textContent = '¡Usuario registrado exitosamente! Ya puedes iniciar sesión';
        successDiv.style.display = 'block';
        setTimeout(() => successDiv.style.display = 'none', 4000);
    }
    
    // Limpiar formulario
    idInput.value = '';
    nombreInput.value = '';
    emailInput.value = '';
    passwordInput.value = '';
    
    // Cerrar el formulario de registro
    const registerSection = document.getElementById('registerSection');
    const toggleBtn = document.getElementById('toggleBtn');
    if (registerSection) registerSection.classList.remove('active');
    if (toggleBtn) toggleBtn.textContent = 'Crear Nueva Cuenta';
    
    return false;
}

function cerrarSesion(): void {
    console.log('🚪 Cerrando sesión...');
    
    // Cerrar sesión
    cerrarSesionGuard();
    
    // Redirigir al login
    window.location.replace('login.html');
}

// ================== INTERFAZ - VIDEOJUEGOS ==================
function mostrarJuegos(juegos: Videojuego[], contenedorId: string): void {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor) {
        console.warn(`⚠️ Contenedor ${contenedorId} no encontrado`);
        return;
    }
    
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
function mostrarJuegosBeta(juegos: VideojuegoBeta[], contenedorId: string): void {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor) {
        console.warn(`⚠️ Contenedor ${contenedorId} no encontrado`);
        return;
    }
    
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
    `}).join("");
}

// ================== INTERFAZ - RESEÑAS ==================
function mostrarReseñas(reseñas: Reseña[], contenedorId: string): void {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor) {
        console.warn(`⚠️ Contenedor ${contenedorId} no encontrado`);
        return;
    }
    
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
function agregarVideojuego(nuevoJuego: Videojuego): void {
    listaVideojuegos.push(nuevoJuego);
    guardarVideojuegos(listaVideojuegos);
}

function obtenerAllVideojuegos(): Videojuego[] {
    return listaVideojuegos.filter(j => j.getActivo());
}

function obtenerVideojuegoPorID(id: number): Videojuego | null {
    return listaVideojuegos.find(j => j.getId() === id && j.getActivo()) || null;
}

function eliminarVideojuego(id: number): void {
    const juego = listaVideojuegos.find(j => j.getId() === id && j.getActivo());
    if (juego) {
        juego.setActivo(false);
        guardarVideojuegos(listaVideojuegos);
    }
}

// ================== CRUD VIDEOJUEGOS BETA ==================
function agregarVideojuegoBeta(nuevoJuego: VideojuegoBeta): void {
    listaVideojuegosBeta.push(nuevoJuego);
    guardarVideojuegosBeta(listaVideojuegosBeta);
}

function obtenerAllVideojuegosBeta(): VideojuegoBeta[] {
    return listaVideojuegosBeta.filter(j => j.getActivo());
}

function obtenerVideojuegoBetaPorID(id: number): VideojuegoBeta | null {
    return listaVideojuegosBeta.find(j => j.getId() === id && j.getActivo()) || null;
}

function eliminarVideojuegoBeta(id: number): void {
    const juego = listaVideojuegosBeta.find(j => j.getId() === id && j.getActivo());
    if (juego) {
        juego.setActivo(false);
        guardarVideojuegosBeta(listaVideojuegosBeta);
    }
}

// ================== CRUD RESEÑAS ==================
function agregarReseña(nuevaReseña: Reseña): void {
    listaReseñas.push(nuevaReseña);
    guardarReseñas(listaReseñas);
}

function eliminarReseña(id: number): void {
    const r = listaReseñas.find(r => r.getIdReseña() === id && r.getActivo());
    if (r) {
        r.setActivo(false);
        guardarReseñas(listaReseñas);
    }
}

// ================== FUNCIONES VINCULADAS A BOTONES - VIDEOJUEGOS ==================
function mostrarTodosLosJuegos(): void {
    mostrarJuegos(obtenerAllVideojuegos(), "todosJuegos");
}

function agregarNuevoJuego(): void {
    const idInput = document.getElementById('nuevoId') as HTMLInputElement;
    const tituloInput = document.getElementById('nuevoTitulo') as HTMLInputElement;
    const generoInput = document.getElementById('nuevoGenero') as HTMLInputElement;
    const desarrolladorInput = document.getElementById('nuevoDesarrollador') as HTMLInputElement;
    const añoInput = document.getElementById('nuevoAño') as HTMLInputElement;
    const plataformaInput = document.getElementById('nuevaPlataforma') as HTMLInputElement;
    const descripcionInput = document.getElementById('nuevaDescripcion') as HTMLTextAreaElement;
    const precioInput = document.getElementById('nuevoPrecio') as HTMLInputElement;
    const estadoInput = document.getElementById('nuevoEstado') as HTMLSelectElement;
    const ratingInput = document.getElementById('nuevoRating') as HTMLInputElement;

    if (!idInput || !tituloInput || !generoInput || !desarrolladorInput || 
        !añoInput || !plataformaInput || !descripcionInput || !precioInput || 
        !estadoInput || !ratingInput) {
        alert('Error: Faltan campos del formulario');
        return;
    }

    const Id = parseInt(idInput.value);
    const título = tituloInput.value.trim();
    const genero = generoInput.value.trim();
    const desarrollador = desarrolladorInput.value.trim();
    const añoLanzamiento = parseInt(añoInput.value);
    const plataforma = plataformaInput.value.trim();
    const descripcion = descripcionInput.value.trim();
    const precio = parseInt(precioInput.value);
    const estado = estadoInput.value;
    const rating = parseFloat(ratingInput.value);

    // Validaciones
    if (isNaN(Id) || !título || !genero || !desarrollador || isNaN(añoLanzamiento) || 
        !plataforma || !descripcion || isNaN(precio) || isNaN(rating)) {
        alert('Por favor completa todos los campos correctamente');
        return;
    }

    if (listaVideojuegos.some(j => j.getId() === Id)) {
        alert('Ya existe un juego con ese ID');
        return;
    }

    const nuevoJuego = new Videojuego(
        Id, título, genero, desarrollador, añoLanzamiento,
        plataforma, descripcion, precio, estado, rating, true
    );

    agregarVideojuego(nuevoJuego);
    alert("Juego agregado y guardado en LocalStorage!");
    
    // Limpiar campos
    idInput.value = '';
    tituloInput.value = '';
    generoInput.value = '';
    desarrolladorInput.value = '';
    añoInput.value = '';
    plataformaInput.value = '';
    descripcionInput.value = '';
    precioInput.value = '';
    ratingInput.value = '';
}

function buscarPorId(): void {
    const idInput = document.getElementById('buscarId') as HTMLInputElement;
    if (!idInput) return;
    
    const id = parseInt(idInput.value);
    if (isNaN(id)) {
        const contenedor = document.getElementById("resultadoBusqueda");
        if (contenedor) {
            contenedor.innerHTML = "<div class='no-results'>Por favor ingresa un ID válido</div>";
        }
        return;
    }
    
    const juego = obtenerVideojuegoPorID(id);
    if (juego) {
        mostrarJuegos([juego], "resultadoBusqueda");
    } else {
        const contenedor = document.getElementById("resultadoBusqueda");
        if (contenedor) {
            contenedor.innerHTML = "<div class='no-results'>No se encontró el juego</div>";
        }
    }
}

function buscarPorGenero(): void {
    const generoInput = document.getElementById('buscarGenero') as HTMLInputElement;
    if (!generoInput) return;
    
    const genero = generoInput.value.toLowerCase().trim();
    if (!genero) {
        alert('Por favor ingresa un género');
        return;
    }
    
    const juegos = listaVideojuegos.filter(j => 
        j.getGenero().toLowerCase().includes(genero) && j.getActivo()
    );
    mostrarJuegos(juegos, "resultadoGenero");
}

function actualizarJuego(): void {
    const idInput = document.getElementById('actualizarId') as HTMLInputElement;
    if (!idInput) return;
    
    const id = parseInt(idInput.value);
    const juego = listaVideojuegos.find(j => j.getId() === id && j.getActivo());

    if (juego) {
        const tituloInput = document.getElementById('actualizarTitulo') as HTMLInputElement;
        const generoInput = document.getElementById('actualizarGenero') as HTMLInputElement;
        const desarrolladorInput = document.getElementById('actualizarDesarrollador') as HTMLInputElement;
        const precioInput = document.getElementById('actualizarPrecio') as HTMLInputElement;
        const ratingInput = document.getElementById('actualizarRating') as HTMLInputElement;

        if (tituloInput && tituloInput.value) juego.setTítulo(tituloInput.value);
        if (generoInput && generoInput.value) juego.setGenero(generoInput.value);
        if (desarrolladorInput && desarrolladorInput.value) juego.setDesarrollador(desarrolladorInput.value);
        if (precioInput && precioInput.value) juego.setPrecio(parseInt(precioInput.value));
        if (ratingInput && ratingInput.value) juego.setRating(parseFloat(ratingInput.value));

        guardarVideojuegos(listaVideojuegos);
        mostrarJuegos([juego], "resultadoActualizacion");
        alert("Juego actualizado y guardado!");
    } else {
        const contenedor = document.getElementById("resultadoActualizacion");
        if (contenedor) {
            contenedor.innerHTML = "<div class='no-results'>No se encontró el videojuego con ese ID</div>";
        }
    }
}

function eliminarJuego(): void {
    const idInput = document.getElementById('eliminarId') as HTMLInputElement;
    if (!idInput) return;
    
    const id = parseInt(idInput.value);
    if (isNaN(id)) {
        alert('Por favor ingresa un ID válido');
        return;
    }
    
    const juego = obtenerVideojuegoPorID(id);
    if (!juego) {
        alert('No se encontró el juego con ese ID');
        return;
    }
    
    if (confirm(`¿Estás seguro de eliminar "${juego.getTítulo()}"?`)) {
        eliminarVideojuego(id);
        alert("Juego eliminado!");
        idInput.value = '';
    }
}

// ================== FUNCIONES VINCULADAS A BOTONES - VIDEOJUEGOS BETA ==================
function mostrarTodosLosJuegosBeta(): void {
    mostrarJuegosBeta(obtenerAllVideojuegosBeta(), "todosJuegosBeta");
}

function agregarNuevoJuegoBeta(): void {
    const idInput = document.getElementById('nuevoBetaId') as HTMLInputElement;
    const tituloInput = document.getElementById('nuevoBetaTitulo') as HTMLInputElement;
    const generoInput = document.getElementById('nuevoBetaGenero') as HTMLInputElement;
    const desarrolladorInput = document.getElementById('nuevoBetaDesarrollador') as HTMLInputElement;
    const añoInput = document.getElementById('nuevoBetaAño') as HTMLInputElement;
    const plataformaInput = document.getElementById('nuevoBetaPlataforma') as HTMLInputElement;
    const descripcionInput = document.getElementById('nuevoBetaDescripcion') as HTMLTextAreaElement;
    const ratingInput = document.getElementById('nuevoBetaRating') as HTMLInputElement;
    const fechaInput = document.getElementById('nuevoBetaFecha') as HTMLInputElement;
    const versionInput = document.getElementById('nuevoBetaVersion') as HTMLInputElement;

    if (!idInput || !tituloInput || !generoInput || !desarrolladorInput || 
        !añoInput || !plataformaInput || !descripcionInput || !ratingInput || 
        !fechaInput || !versionInput) {
        alert('Error: Faltan campos del formulario');
        return;
    }

    const Id = parseInt(idInput.value);
    const título = tituloInput.value.trim();
    const genero = generoInput.value.trim();
    const desarrollador = desarrolladorInput.value.trim();
    const añoLanzamiento = parseInt(añoInput.value);
    const plataforma = plataformaInput.value.trim();
    const descripcion = descripcionInput.value.trim();
    const rating = parseFloat(ratingInput.value);
    const fechaAcceso = fechaInput.value.trim();
    const version = versionInput.value.trim();

    if (isNaN(Id) || !título || !genero || !desarrollador || isNaN(añoLanzamiento) || 
        !plataforma || !descripcion || isNaN(rating) || !fechaAcceso || !version) {
        alert('Por favor completa todos los campos correctamente');
        return;
    }

    if (listaVideojuegosBeta.some(j => j.getId() === Id)) {
        alert('Ya existe un juego beta con ese ID');
        return;
    }

    const nuevoJuegoBeta = new VideojuegoBeta(
        Id, título, genero, desarrollador, añoLanzamiento,
        plataforma, descripcion, 0, "Beta", rating, true,
        fechaAcceso, version
    );

    agregarVideojuegoBeta(nuevoJuegoBeta);
    alert("Juego Beta agregado y guardado!");
    
    // Limpiar campos
    idInput.value = '';
    tituloInput.value = '';
    generoInput.value = '';
    desarrolladorInput.value = '';
    añoInput.value = '';
    plataformaInput.value = '';
    descripcionInput.value = '';
    ratingInput.value = '';
    fechaInput.value = '';
    versionInput.value = '';
}

function buscarBetaPorId(): void {
    const idInput = document.getElementById('buscarBetaId') as HTMLInputElement;
    if (!idInput) return;
    
    const id = parseInt(idInput.value);
    if (isNaN(id)) {
        const contenedor = document.getElementById("resultadoBusquedaBeta");
        if (contenedor) {
            contenedor.innerHTML = "<div class='no-results'>Por favor ingresa un ID válido</div>";
        }
        return;
    }
    
    const juego = obtenerVideojuegoBetaPorID(id);
    if (juego) {
        mostrarJuegosBeta([juego], "resultadoBusquedaBeta");
    } else {
        const contenedor = document.getElementById("resultadoBusquedaBeta");
        if (contenedor) {
            contenedor.innerHTML = "<div class='no-results'>No se encontró el juego beta</div>";
        }
    }
}

function agregarFeedbackBeta(): void {
    const idInput = document.getElementById('feedbackBetaId') as HTMLInputElement;
    const feedbackInput = document.getElementById('feedbackTexto') as HTMLTextAreaElement;
    
    if (!idInput || !feedbackInput) return;
    
    const id = parseInt(idInput.value);
    const feedback = feedbackInput.value.trim();
    
    if (isNaN(id) || !feedback) {
        alert('Por favor completa el ID y el feedback');
        return;
    }
    
    const juego = obtenerVideojuegoBetaPorID(id);
    
    if (juego) {
        juego.agregarFeedback(feedback);
        guardarVideojuegosBeta(listaVideojuegosBeta);
        
        alert("Feedback agregado y guardado exitosamente!");
        feedbackInput.value = '';
        mostrarJuegosBeta([juego], "resultadoFeedback");
    } else {
        alert("No se encontró el juego beta con ese ID");
    }
}

function actualizarJuegoBeta(): void {
    const idInput = document.getElementById('actualizarBetaId') as HTMLInputElement;
    if (!idInput) return;
    
    const id = parseInt(idInput.value);
    const juego = listaVideojuegosBeta.find(j => j.getId() === id && j.getActivo());

    if (juego) {
        const tituloInput = document.getElementById('actualizarBetaTitulo') as HTMLInputElement;
        const versionInput = document.getElementById('actualizarBetaVersion') as HTMLInputElement;
        const ratingInput = document.getElementById('actualizarBetaRating') as HTMLInputElement;

        if (tituloInput && tituloInput.value) juego.setTítulo(tituloInput.value);
        if (versionInput && versionInput.value) juego.setVersion(versionInput.value);
        if (ratingInput && ratingInput.value) juego.setRating(parseFloat(ratingInput.value));

        guardarVideojuegosBeta(listaVideojuegosBeta);
        mostrarJuegosBeta([juego], "resultadoActualizacionBeta");
        alert("Juego Beta actualizado y guardado!");
    } else {
        const contenedor = document.getElementById("resultadoActualizacionBeta");
        if (contenedor) {
            contenedor.innerHTML = "<div class='no-results'>No se encontró el videojuego beta con ese ID</div>";
        }
    }
}

function eliminarJuegoBeta(): void {
    const idInput = document.getElementById('eliminarBetaId') as HTMLInputElement;
    if (!idInput) return;
    
    const id = parseInt(idInput.value);
    if (isNaN(id)) {
        alert('Por favor ingresa un ID válido');
        return;
    }
    
    const juego = obtenerVideojuegoBetaPorID(id);
    if (!juego) {
        alert('No se encontró el juego beta con ese ID');
        return;
    }
    
    if (confirm(`¿Estás seguro de eliminar "${juego.getTítulo()}"?`)) {
        eliminarVideojuegoBeta(id);
        alert("Juego Beta eliminado!");
        idInput.value = '';
    }
}

// ================== FUNCIONES VINCULADAS A BOTONES - RESEÑAS ==================
function buscarReseñaPorId(): void {
    const idInput = document.getElementById('buscarReseñaId') as HTMLInputElement;
    if (!idInput) return;
    
    const id = parseInt(idInput.value);
    if (isNaN(id)) {
        const contenedor = document.getElementById("resultadoBusquedaReseña");
        if (contenedor) {
            contenedor.innerHTML = "<div class='no-results'>Por favor ingresa un ID válido</div>";
        }
        return;
    }
    
    const reseña = listaReseñas.find(r => r.getIdReseña() === id && r.getActivo());
    
    if (reseña) {
        mostrarReseñas([reseña], "resultadoBusquedaReseña");
    } else {
        const contenedor = document.getElementById("resultadoBusquedaReseña");
        if (contenedor) {
            contenedor.innerHTML = "<div class='no-results'>No se encontró la reseña</div>";
        }
    }
}

function filtrarPorCalificacion(): void {
    const calificacionInput = document.getElementById('filtroCalificacion') as HTMLInputElement;
    if (!calificacionInput) return;
    
    const calificacionMinima = parseFloat(calificacionInput.value);
    if (isNaN(calificacionMinima)) {
        alert('Por favor ingresa una calificación válida');
        return;
    }
    
    const reseñasFiltradas = listaReseñas.filter(r => 
        r.getCalificacion() >= calificacionMinima && r.getActivo()
    );
    mostrarReseñas(reseñasFiltradas, "resultadoFiltroCalificacion");
}

function agregarNuevaReseña(): void {
    const idInput = document.getElementById('nuevaReseñaId') as HTMLInputElement;
    const usuarioInput = document.getElementById('nuevoUsuario') as HTMLInputElement;
    const comentarioInput = document.getElementById('nuevoComentario') as HTMLTextAreaElement;
    const calificacionInput = document.getElementById('nuevaCalificacion') as HTMLInputElement;
    const fechaInput = document.getElementById('nuevaFecha') as HTMLInputElement;
    
    if (!idInput || !usuarioInput || !comentarioInput || !calificacionInput || !fechaInput) {
        alert('Error: Faltan campos del formulario');
        return;
    }
    
    const idReseña = parseInt(idInput.value);
    const usuario = usuarioInput.value.trim();
    const comentario = comentarioInput.value.trim();
    const calificación = parseFloat(calificacionInput.value);
    const fecha = fechaInput.value.trim();
    
    if (isNaN(idReseña) || !usuario || !comentario || isNaN(calificación) || !fecha) {
        alert('Por favor completa todos los campos correctamente');
        return;
    }
    
    if (listaReseñas.some(r => r.getIdReseña() === idReseña)) {
        alert('Ya existe una reseña con ese ID');
        return;
    }
    
    const nuevaReseña = new Reseña(idReseña, usuario, comentario, calificación, fecha, true);
    agregarReseña(nuevaReseña);
    alert("Reseña agregada y guardada!");
    
    // Limpiar campos
    idInput.value = '';
    usuarioInput.value = '';
    comentarioInput.value = '';
    calificacionInput.value = '';
    fechaInput.value = '';
}

function mostrarTodasLasReseñas(): void {
    mostrarReseñas(listaReseñas.filter(r => r.getActivo()), "todasReseñas");
}

function actualizarReseñaCompleta(): void {
    const idInput = document.getElementById('actualizarReseñaId') as HTMLInputElement;
    if (!idInput) return;
    
    const id = parseInt(idInput.value);
    const reseña = listaReseñas.find(r => r.getIdReseña() === id && r.getActivo());

    if (reseña) {
        const usuarioInput = document.getElementById('actualizarUsuario') as HTMLInputElement;
        const comentarioInput = document.getElementById('actualizarComentario') as HTMLTextAreaElement;
        const calificacionInput = document.getElementById('actualizarCalificacion') as HTMLInputElement;

        if (usuarioInput && usuarioInput.value) reseña.setUsuario(usuarioInput.value);
        if (comentarioInput && comentarioInput.value) reseña.setComentario(comentarioInput.value);
        if (calificacionInput && calificacionInput.value) {
            reseña.setCalificacion(parseFloat(calificacionInput.value));
        }

        guardarReseñas(listaReseñas);
        alert("Reseña actualizada y guardada!");
    } else {
        alert("No se encontró la reseña con ese ID");
    }
}

function eliminarReseñaCompleta(): void {
    const idInput = document.getElementById('eliminarReseñaId') as HTMLInputElement;
    if (!idInput) return;
    
    const id = parseInt(idInput.value);
    if (isNaN(id)) {
        alert('Por favor ingresa un ID válido');
        return;
    }
    
    const reseña = listaReseñas.find(r => r.getIdReseña() === id && r.getActivo());
    if (!reseña) {
        alert('No se encontró la reseña con ese ID');
        return;
    }
    
    if (confirm(`¿Estás seguro de eliminar la reseña de "${reseña.getUsuario()}"?`)) {
        eliminarReseña(id);
        alert("Reseña eliminada!");
        idInput.value = '';
    }
}

// ================== FUNCIONES PARA RAWG Y CHEAPSHARK API ==================
import { buscarJuego, buscarJuegoPorGenero } from "./rawgAPI.js";
import { 
    buscarJuegoPorNombre, 
    obtenerDetallesJuego, 
    obtenerMejoresOfertas,
    TIENDAS_CHEAPSHARK,
    type JuegoCheapShark 
} from "./cheapshark.js";

interface JuegoRAWG {
    id: number;
    name: string;
    background_image: string;
    rating: number;
    genres: Array<{ id: number; name: string }>;
    released: string;
    platforms: Array<{
        platform: {
            id: number;
            name: string;
        };
    }>;
}

function renderizarJuegoRAWG(juego: JuegoRAWG): string {
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

async function buscarPorGeneroMejorado(): Promise<void> {
    const generoInput = document.getElementById('buscarGenero') as HTMLInputElement;
    const container = document.getElementById('resultadoGenero');
    
    if (!generoInput || !container) return;
    
    const genero = generoInput.value.trim();
    
    if (!genero) {
        alert('Por favor ingresa un género');
        return;
    }
    
    container.innerHTML = '<p style="text-align: center; padding: 20px;">🔍 Buscando en base de datos local y RAWG API...</p>';
    
    try {
        const juegosLocales = listaVideojuegos.filter(j => 
            j.getGenero().toLowerCase().includes(genero.toLowerCase()) && j.getActivo()
        );
        
        const juegosAPI = await buscarJuegoPorGenero(genero);
        
        let html = '';
        
        if (juegosLocales.length > 0) {
            html += '<div style="margin-bottom: 30px;">';
            html += '<h3 style="color: #2d3748; margin-bottom: 15px; padding: 10px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px;">📚 Juegos en tu Colección Local</h3>';
            html += juegosLocales.map(j => {
                return `
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
        
    } catch (error) {
        console.error('Error al buscar juegos:', error);
        container.innerHTML = `
            <div class="no-results">
                <p>❌ Error al buscar juegos. Por favor intenta de nuevo.</p>
            </div>
        `;
    }
}

async function buscarJuegoEnRAWG(): Promise<void> {
    const nombreInput = document.getElementById('buscarNombreRAWG') as HTMLInputElement;
    const container = document.getElementById('resultadoRAWG');
    
    if (!nombreInput || !container) return;
    
    const nombre = nombreInput.value.trim();
    
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
        
    } catch (error) {
        console.error('Error al buscar en RAWG:', error);
        container.innerHTML = `
            <div class="no-results">
                <p>❌ Error al buscar en RAWG. Por favor intenta de nuevo.</p>
            </div>
        `;
    }
}

async function mostrarJuegosPopularesRAWG(): Promise<void> {
    const container = document.getElementById('juegosPopularesRAWG');
    
    if (!container) return;
    
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
        
    } catch (error) {
        console.error('Error al cargar juegos populares:', error);
        container.innerHTML = `
            <div class="no-results">
                <p>❌ Error al cargar juegos populares. Por favor intenta de nuevo.</p>
            </div>
        `;
    }
}

function renderizarJuegoCheapShark(juego: JuegoCheapShark): string {
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

async function buscarPreciosEnCheapShark(): Promise<void> {
    const nombreInput = document.getElementById('buscarPrecioCheapShark') as HTMLInputElement;
    const container = document.getElementById('resultadoCheapShark');
    
    if (!nombreInput || !container) return;
    
    const nombre = nombreInput.value.trim();
    
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
        
    } catch (error) {
        console.error('Error al buscar en CheapShark:', error);
        container.innerHTML = `
            <div class="no-results">
                <p>❌ Error al buscar precios. Por favor intenta de nuevo.</p>
            </div>
        `;
    }
}

async function verDetallesOferta(gameID: string): Promise<void> {
    const container = document.getElementById('detallesOferta');
    
    if (!container) return;
    
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
        
    } catch (error) {
        console.error('Error al cargar detalles:', error);
        container.innerHTML = '<div class="no-results">❌ Error al cargar ofertas</div>';
    }
}

async function mostrarMejoresOfertas(): Promise<void> {
    const container = document.getElementById('mejoresOfertas');
    
    if (!container) return;
    
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
        
    } catch (error) {
        console.error('Error:', error);
        container.innerHTML = '<div class="no-results">❌ Error al cargar ofertas</div>';
    }
}

// ================== EXPONER FUNCIONES AL HTML ==================
(window as any).iniciarSesion = iniciarSesion;
(window as any).registrarUsuario = registrarUsuario;
(window as any).cerrarSesion = cerrarSesion;
(window as any).mostrarTodosLosJuegos = mostrarTodosLosJuegos;
(window as any).agregarNuevoJuego = agregarNuevoJuego;
(window as any).buscarPorId = buscarPorId;
(window as any).buscarPorGenero = buscarPorGenero;
(window as any).actualizarJuego = actualizarJuego;
(window as any).eliminarJuego = eliminarJuego;
(window as any).mostrarTodosLosJuegosBeta = mostrarTodosLosJuegosBeta;
(window as any).agregarNuevoJuegoBeta = agregarNuevoJuegoBeta;
(window as any).buscarBetaPorId = buscarBetaPorId;
(window as any).agregarFeedbackBeta = agregarFeedbackBeta;
(window as any).actualizarJuegoBeta = actualizarJuegoBeta;
(window as any).eliminarJuegoBeta = eliminarJuegoBeta;
(window as any).buscarReseñaPorId = buscarReseñaPorId;
(window as any).filtrarPorCalificacion = filtrarPorCalificacion;
(window as any).agregarNuevaReseña = agregarNuevaReseña;
(window as any).mostrarTodasLasReseñas = mostrarTodasLasReseñas;
(window as any).actualizarReseñaCompleta = actualizarReseñaCompleta;
(window as any).eliminarReseñaCompleta = eliminarReseñaCompleta;
(window as any).buscarPorGeneroMejorado = buscarPorGeneroMejorado;
(window as any).buscarJuegoEnRAWG = buscarJuegoEnRAWG;
(window as any).mostrarJuegosPopularesRAWG = mostrarJuegosPopularesRAWG;
(window as any).buscarPreciosEnCheapShark = buscarPreciosEnCheapShark;
(window as any).verDetallesOferta = verDetallesOferta;
(window as any).mostrarMejoresOfertas = mostrarMejoresOfertas;

console.log('✅ Todas las funciones expuestas correctamente');