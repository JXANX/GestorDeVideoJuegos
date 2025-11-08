// sessionGuard.ts - Sistema de protección de sesión (FUNCIONAL SIN BUCLES)
// ==================== CONFIGURACIÓN ====================
const KEYS = {
    SESION_ACTIVA: 'gestion_videojuegos_sesion',
    ULTIMA_ACTIVIDAD: 'gestion_videojuegos_ultima_actividad'
};
// ==================== FUNCIONES PÚBLICAS ====================
/**
 * Genera un token único para la sesión
 */
function generarToken() {
    return `${Date.now()}_${Math.random().toString(36).substring(2)}`;
}
/**
 * Guarda la sesión con token único
 */
export function guardarSesion(usuario) {
    const sesionData = {
        usuarioId: usuario.getIdUsuario(),
        correo: usuario.getCorreo(),
        nombre: usuario.getNombre(),
        fechaInicio: new Date().toISOString(),
        token: generarToken()
    };
    try {
        localStorage.setItem(KEYS.SESION_ACTIVA, JSON.stringify(sesionData));
        localStorage.setItem(KEYS.ULTIMA_ACTIVIDAD, Date.now().toString());
        console.log('✅ Sesión guardada');
        return true;
    }
    catch (error) {
        console.error('❌ Error al guardar sesión:', error);
        return false;
    }
}
/**
 * Obtiene la sesión actual
 */
export function obtenerSesion() {
    try {
        const sesionStr = localStorage.getItem(KEYS.SESION_ACTIVA);
        if (!sesionStr)
            return null;
        return JSON.parse(sesionStr);
    }
    catch (error) {
        console.error('❌ Error al obtener sesión:', error);
        return null;
    }
}
/**
 * Cierra la sesión
 */
export function cerrarSesion() {
    localStorage.removeItem(KEYS.SESION_ACTIVA);
    localStorage.removeItem(KEYS.ULTIMA_ACTIVIDAD);
    console.log('🚪 Sesión cerrada');
}
/**
 * Verifica si hay sesión activa
 */
export function hayUsuarioLogueado() {
    return obtenerSesion() !== null;
}
/**
 * Protege las páginas según el estado de la sesión
 * Evita bucles de redirección
 */
export function protegerRuta() {
    const rutaActual = window.location.pathname;
    const enLogin = rutaActual.includes('login');
    const logueado = hayUsuarioLogueado();
    // ✅ Si NO está logueado y NO está en login → redirigir al login
    if (!logueado && !enLogin) {
        console.warn('🔒 Acceso denegado. Redirigiendo al login...');
        window.location.href = '/login.html';
        return;
    }
    // ✅ Si está logueado y está en login → redirigir al home
    if (logueado && enLogin) {
        console.log('➡️ Ya hay sesión. Redirigiendo al home...');
        window.location.href = '/index.html'; // o donde tengas tu página principal
        return;
    }
    // ✅ Si pasa las condiciones, no hacer nada
    console.log('✅ Acceso permitido a:', rutaActual);
}
//# sourceMappingURL=sessionGuard.js.map