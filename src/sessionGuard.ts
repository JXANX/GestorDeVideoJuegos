// sessionGuard.ts - Sistema de protección de sesión

// ==================== CONFIGURACIÓN ====================
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutos
const CHECK_INTERVAL = 5000; // Verifica cada 5 segundos

const KEYS = {
    SESION_ACTIVA: 'gestion_videojuegos_sesion',
    ULTIMA_ACTIVIDAD: 'gestion_videojuegos_ultima_actividad'
};

// Páginas que NO requieren autenticación
const PAGINAS_PUBLICAS = ['login.html', 'registro.html'];

// ==================== INTERFACES ====================
interface SesionData {
    usuarioId: number;
    correo: string;
    nombre: string;
    fechaInicio: string;
    token: string; // Token único de sesión
}

// ==================== FUNCIONES DE SESIÓN ====================

/**
 * Genera un token único para la sesión
 */
function generarToken(): string {
    return `${Date.now()}_${Math.random().toString(36).substring(2)}`;
}

/**
 * Guarda la sesión con token único
 */
export function guardarSesion(usuario: any): boolean {
    const sesionData: SesionData = {
        usuarioId: usuario.getIdUsuario(),
        correo: usuario.getCorreo(),
        nombre: usuario.getNombre(),
        fechaInicio: new Date().toISOString(),
        token: generarToken()
    };
    
    try {
        localStorage.setItem(KEYS.SESION_ACTIVA, JSON.stringify(sesionData));
        actualizarUltimaActividad();
        console.log('✅ Sesión guardada con token:', sesionData.token);
        return true;
    } catch (error) {
        console.error('❌ Error al guardar sesión:', error);
        return false;
    }
}

/**
 * Obtiene la sesión actual si es válida
 */
export function obtenerSesion(): SesionData | null {
    try {
        const sesionStr = localStorage.getItem(KEYS.SESION_ACTIVA);
        if (!sesionStr) return null;
        
        const sesion: SesionData = JSON.parse(sesionStr);
        
        // Verificar si la sesión ha expirado
        if (haExpiradoSesion()) {
            console.warn('⚠️ Sesión expirada por inactividad');
            cerrarSesion();
            return null;
        }
        
        return sesion;
    } catch (error) {
        console.error('❌ Error al obtener sesión:', error);
        return null;
    }
}

/**
 * Cierra la sesión y limpia todos los datos
 */
export function cerrarSesion(): void {
    localStorage.removeItem(KEYS.SESION_ACTIVA);
    localStorage.removeItem(KEYS.ULTIMA_ACTIVIDAD);
    console.log('🚪 Sesión cerrada');
}

/**
 * Actualiza el timestamp de última actividad
 */
function actualizarUltimaActividad(): void {
    localStorage.setItem(KEYS.ULTIMA_ACTIVIDAD, Date.now().toString());
}

/**
 * Verifica si la sesión ha expirado por inactividad
 */
function haExpiradoSesion(): boolean {
    const ultimaActividadStr = localStorage.getItem(KEYS.ULTIMA_ACTIVIDAD);
    if (!ultimaActividadStr) return true;
    
    const ultimaActividad = parseInt(ultimaActividadStr);
    const tiempoTranscurrido = Date.now() - ultimaActividad;
    
    return tiempoTranscurrido > SESSION_TIMEOUT;
}

/**
 * Verifica si hay una sesión válida activa
 */
export function hayUsuarioLogueado(): boolean {
    return obtenerSesion() !== null;
}

// ==================== PROTECCIÓN DE PÁGINAS ====================

/**
 * Verifica si la página actual requiere autenticación
 */
function requiereAutenticacion(): boolean {
    const paginaActual = window.location.pathname.split('/').pop() || 'index.html';
    return !PAGINAS_PUBLICAS.some(pagina => paginaActual.includes(pagina));
}

/**
 * Redirige al login si no hay sesión válida
 */
function verificarSesionYRedirigir(): void {
    if (requiereAutenticacion() && !hayUsuarioLogueado()) {
        console.warn('⚠️ Acceso denegado. Redirigiendo al login...');
        
        // Prevenir que el usuario regrese con el botón "Atrás"
        window.history.pushState(null, '', window.location.href);
        window.location.replace('login.html');
    }
}

/**
 * Previene navegación hacia atrás después de cerrar sesión
 */
function prevenirNavegacionAtras(): void {
    window.history.pushState(null, '', window.location.href);
    
    window.addEventListener('popstate', function(event) {
        if (!hayUsuarioLogueado() && requiereAutenticacion()) {
            window.history.pushState(null, '', window.location.href);
            window.location.replace('login.html');
        }
    });
}

/**
 * Monitorea la actividad del usuario
 */
function monitorearActividad(): void {
    // Actualizar timestamp en cada interacción
    const eventos = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    
    eventos.forEach(evento => {
        document.addEventListener(evento, () => {
            if (hayUsuarioLogueado()) {
                actualizarUltimaActividad();
            }
        }, true);
    });
    
    // Verificar periódicamente si la sesión sigue válida
    setInterval(() => {
        if (requiereAutenticacion() && haExpiradoSesion()) {
            alert('Tu sesión ha expirado por inactividad. Por favor, inicia sesión nuevamente.');
            cerrarSesion();
            window.location.replace('login.html');
        }
    }, CHECK_INTERVAL);
}

/**
 * Detecta si el usuario intenta acceder desde otra pestaña
 */
function detectarMultiplesSesiones(): void {
    window.addEventListener('storage', (event) => {
        // Si se cierra sesión en otra pestaña
        if (event.key === KEYS.SESION_ACTIVA && event.newValue === null) {
            console.warn('⚠️ Sesión cerrada en otra pestaña');
            window.location.replace('login.html');
        }
    });
}

// ==================== INICIALIZACIÓN AUTOMÁTICA ====================

/**
 * Inicializa el sistema de protección de sesión
 * Se ejecuta automáticamente al cargar el script
 */
export function inicializarGuardiaDeSesion(): void {
    console.log('🔒 Inicializando guardia de sesión...');
    
    // 1. Verificar sesión inmediatamente
    verificarSesionYRedirigir();
    
    // 2. Prevenir navegación hacia atrás
    prevenirNavegacionAtras();
    
    // 3. Monitorear actividad del usuario
    monitorearActividad();
    
    // 4. Detectar cambios en otras pestañas
    detectarMultiplesSesiones();
    
    console.log('✅ Guardia de sesión activa');
}

// ==================== AUTO-EJECUCIÓN ====================
// Se ejecuta automáticamente cuando se carga el módulo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarGuardiaDeSesion);
} else {
    inicializarGuardiaDeSesion();
}