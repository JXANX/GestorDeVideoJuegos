// localStorage.ts
// Módulo para gestionar el almacenamiento local de datos
import { Usuario } from "./models/Usuario.js";
import { Videojuego } from "./models/Videojuego.js";
import { VideojuegoBeta } from "./models/VideoJuegoBeta.js";
import { Reseña } from "./models/Reseña.js";
// ==================== CLAVES DE LOCALSTORAGE ====================
const KEYS = {
    USUARIOS: 'gestion_videojuegos_usuarios',
    VIDEOJUEGOS: 'gestion_videojuegos_juegos',
    VIDEOJUEGOS_BETA: 'gestion_videojuegos_beta',
    RESEÑAS: 'gestion_videojuegos_reseñas',
    SESION_ACTIVA: 'gestion_videojuegos_sesion'
};
// ==================== FUNCIONES AUXILIARES ====================
/**
 * Guarda datos en LocalStorage de forma segura
 */
function guardarEnStorage(key, data) {
    try {
        const jsonData = JSON.stringify(data);
        localStorage.setItem(key, jsonData);
        return true;
    }
    catch (error) {
        console.error(`Error al guardar en LocalStorage (${key}):`, error);
        return false;
    }
}
/**
 * Obtiene datos de LocalStorage de forma segura
 */
function obtenerDeStorage(key, defaultValue) {
    try {
        const jsonData = localStorage.getItem(key);
        if (jsonData === null) {
            return defaultValue;
        }
        return JSON.parse(jsonData);
    }
    catch (error) {
        console.error(`Error al leer de LocalStorage (${key}):`, error);
        return defaultValue;
    }
}
/**
 * Elimina datos de LocalStorage
 */
function eliminarDeStorage(key) {
    try {
        localStorage.removeItem(key);
    }
    catch (error) {
        console.error(`Error al eliminar de LocalStorage (${key}):`, error);
    }
}
export function guardarUsuarios(usuarios) {
    const usuariosData = usuarios.map(u => ({
        idUsuario: u.getIdUsuario(),
        nombre: u.getNombre(),
        correo: u.getCorreo(),
        contraseña: u.getContraseña(),
        activo: u.getActivo()
    }));
    const resultado = guardarEnStorage(KEYS.USUARIOS, usuariosData);
    if (resultado) {
        console.log('✅ Usuarios guardados en localStorage:', usuariosData.length);
    }
    return resultado;
}
export function cargarUsuarios() {
    const usuariosData = obtenerDeStorage(KEYS.USUARIOS, []);
    console.log('📥 Cargando usuarios desde localStorage:', usuariosData.length);
    // 🔥 IMPORTANTE: Reconstruir instancias con NEW
    const usuarios = usuariosData.map(data => new Usuario(data.idUsuario, data.nombre, data.correo, data.contraseña, data.activo));
    console.log('✅ Usuarios reconstruidos:', usuarios.length);
    return usuarios;
}
export function guardarVideojuegos(videojuegos) {
    const videojuegosData = videojuegos.map(v => ({
        id: v.getId(),
        título: v.getTítulo(),
        genero: v.getGenero(),
        desarrollador: v.getDesarrollador(),
        añoLanzamiento: v.getAñoLanzamiento(),
        plataforma: v.getPlataforma(),
        descripcion: v.getDescripcion(),
        precio: v.getPrecio(),
        estado: v.getEstado(),
        rating: v.getRating(),
        activo: v.getActivo()
    }));
    const resultado = guardarEnStorage(KEYS.VIDEOJUEGOS, videojuegosData);
    if (resultado) {
        console.log('✅ Videojuegos guardados:', videojuegosData.length);
    }
    return resultado;
}
export function cargarVideojuegos() {
    const videojuegosData = obtenerDeStorage(KEYS.VIDEOJUEGOS, []);
    console.log('📥 Cargando videojuegos:', videojuegosData.length);
    // 🔥 Reconstruir instancias
    return videojuegosData.map(data => new Videojuego(data.id, data.título, data.genero, data.desarrollador, data.añoLanzamiento, data.plataforma, data.descripcion, data.precio, data.estado, data.rating, data.activo));
}
export function guardarVideojuegosBeta(videojuegosBeta) {
    const betaData = videojuegosBeta.map(v => ({
        id: v.getId(),
        título: v.getTítulo(),
        genero: v.getGenero(),
        desarrollador: v.getDesarrollador(),
        añoLanzamiento: v.getAñoLanzamiento(),
        plataforma: v.getPlataforma(),
        descripcion: v.getDescripcion(),
        precio: v.getPrecio(),
        estado: v.getEstado(),
        rating: v.getRating(),
        activo: v.getActivo(),
        fechaAcceso: v.getFechaAcceso(),
        version: v.getVersion(),
        feedback: v.obtenerFeedback()
    }));
    const resultado = guardarEnStorage(KEYS.VIDEOJUEGOS_BETA, betaData);
    if (resultado) {
        console.log('✅ Videojuegos beta guardados:', betaData.length);
    }
    return resultado;
}
export function cargarVideojuegosBeta() {
    const betaData = obtenerDeStorage(KEYS.VIDEOJUEGOS_BETA, []);
    console.log('📥 Cargando videojuegos beta:', betaData.length);
    // 🔥 Reconstruir instancias con feedback
    return betaData.map(data => {
        const beta = new VideojuegoBeta(data.id, data.título, data.genero, data.desarrollador, data.añoLanzamiento, data.plataforma, data.descripcion, data.precio, data.estado, data.rating, data.activo, data.fechaAcceso, data.version);
        // Restaurar feedback
        data.feedback.forEach(fb => beta.agregarFeedback(fb));
        return beta;
    });
}
export function guardarReseñas(reseñas) {
    const reseñasData = reseñas.map(r => ({
        idReseña: r.getIdReseña(),
        usuario: r.getUsuario(),
        comentario: r.getComentario(),
        calificacion: r.getCalificacion(),
        fecha: r.getFecha(),
        activo: r.getActivo()
    }));
    const resultado = guardarEnStorage(KEYS.RESEÑAS, reseñasData);
    if (resultado) {
        console.log('✅ Reseñas guardadas:', reseñasData.length);
    }
    return resultado;
}
export function cargarReseñas() {
    const reseñasData = obtenerDeStorage(KEYS.RESEÑAS, []);
    console.log('📥 Cargando reseñas:', reseñasData.length);
    // 🔥 Reconstruir instancias
    return reseñasData.map(data => new Reseña(data.idReseña, data.usuario, data.comentario, data.calificacion, data.fecha, data.activo));
}
export function guardarSesion(usuario) {
    const sesionData = {
        usuarioId: usuario.getIdUsuario(),
        correo: usuario.getCorreo(),
        nombre: usuario.getNombre(),
        fechaInicio: new Date().toISOString()
    };
    const resultado = guardarEnStorage(KEYS.SESION_ACTIVA, sesionData);
    if (resultado) {
        console.log('✅ Sesión guardada para:', sesionData.nombre);
    }
    return resultado;
}
export function obtenerSesion() {
    const sesion = obtenerDeStorage(KEYS.SESION_ACTIVA, null);
    if (sesion) {
        console.log('📋 Sesión activa:', sesion.nombre);
    }
    return sesion;
}
export function cerrarSesionStorage() {
    eliminarDeStorage(KEYS.SESION_ACTIVA);
    console.log('🚪 Sesión cerrada');
}
export function hayUsuarioLogueado() {
    return obtenerSesion() !== null;
}
// ==================== INICIALIZACIÓN CON DATOS POR DEFECTO ====================
export function inicializarDatosDefault() {
    console.log('🔄 Inicializando datos...');
    // Cargar datos existentes
    let usuarios = cargarUsuarios();
    let videojuegos = cargarVideojuegos();
    let videojuegosBeta = cargarVideojuegosBeta();
    let reseñas = cargarReseñas();
    // Si no hay datos, crear datos por defecto
    if (usuarios.length === 0) {
        console.log('⚠️ No hay usuarios, creando datos por defecto...');
        usuarios = [
            new Usuario(1, "Admin", "admin@game.com", "admin123", true),
            new Usuario(2, "Juan Pérez", "juan@correo.com", "pass123", true)
        ];
        guardarUsuarios(usuarios);
    }
    if (videojuegos.length === 0) {
        console.log('⚠️ No hay videojuegos, creando datos por defecto...');
        videojuegos = [
            new Videojuego(1, "Silkson", "Metroidvania", "Tim Cherri", 2025, "Todas", "Juego 2d de bichos que pelean con aguijones", 50000, "Digital", 9.9, true),
            new Videojuego(2, "Blasphemous", "Metroidvania", "Gueim Quitchen", 2019, "Todas", "Juego 2d de un penitente que mata y busca monjas", 60000, "Digital", 9.9, true),
            new Videojuego(3, "Elden Ring", "Souls", "From Software", 2022, "Todas", "Juego de mundo abierto de volverse el señor del anillo", 300000, "Digital", 9.999, true)
        ];
        guardarVideojuegos(videojuegos);
    }
    if (videojuegosBeta.length === 0) {
        console.log('⚠️ No hay videojuegos beta, creando datos por defecto...');
        const beta1 = new VideojuegoBeta(101, "Hollow Knight: Silksong Beta", "Metroidvania", "Team Cherry", 2024, "PC", "Versión beta del esperado juego", 0, "Beta", 9.5, true, "15-01-2024", "0.9.5");
        beta1.agregarFeedback("Los controles se sienten muy fluidos");
        beta1.agregarFeedback("Necesita más optimización en algunas áreas");
        const beta2 = new VideojuegoBeta(102, "Dark Souls IV Beta", "Souls", "FromSoftware", 2025, "PC, PS5", "Beta cerrada del próximo souls", 0, "Beta", 8.8, true, "20-03-2024", "0.8.2");
        videojuegosBeta = [beta1, beta2];
        guardarVideojuegosBeta(videojuegosBeta);
    }
    if (reseñas.length === 0) {
        console.log('⚠️ No hay reseñas, creando datos por defecto...');
        reseñas = [
            new Reseña(1, "Nigerilo", "Dislike, es muy dificil (me gusta el tubo)", 5.8, "11-09-2025", true),
            new Reseña(2, "sebs.wav", "Masterpiece, historia gooood", 9.99, "11-09-2025", true)
        ];
        guardarReseñas(reseñas);
    }
    console.log('✅ Datos inicializados correctamente');
    return { usuarios, videojuegos, videojuegosBeta, reseñas };
}
// ==================== UTILIDADES ====================
/**
 * Limpia todos los datos del LocalStorage
 */
export function limpiarTodosLosDatos() {
    eliminarDeStorage(KEYS.USUARIOS);
    eliminarDeStorage(KEYS.VIDEOJUEGOS);
    eliminarDeStorage(KEYS.VIDEOJUEGOS_BETA);
    eliminarDeStorage(KEYS.RESEÑAS);
    eliminarDeStorage(KEYS.SESION_ACTIVA);
    console.log('✅ Todos los datos han sido eliminados del LocalStorage');
}
/**
 * Exporta todos los datos como JSON para backup
 */
export function exportarDatos() {
    return JSON.stringify({
        usuarios: obtenerDeStorage(KEYS.USUARIOS, []),
        videojuegos: obtenerDeStorage(KEYS.VIDEOJUEGOS, []),
        videojuegosBeta: obtenerDeStorage(KEYS.VIDEOJUEGOS_BETA, []),
        reseñas: obtenerDeStorage(KEYS.RESEÑAS, [])
    }, null, 2);
}
/**
 * Muestra estadísticas del almacenamiento
 */
export function obtenerEstadisticas() {
    return {
        usuarios: cargarUsuarios().length,
        videojuegos: cargarVideojuegos().length,
        videojuegosBeta: cargarVideojuegosBeta().length,
        reseñas: cargarReseñas().length
    };
}
