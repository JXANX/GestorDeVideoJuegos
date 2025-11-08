import { Videojuego } from "./Videojuego.js";
export class VideojuegoBeta extends Videojuego {
    // ================== CONSTRUCTOR ==================
    // Inicializar tanto los atributos heredados de Videojuego como los propios de la beta
    constructor(id, título, genero, desarrollador, añoLanzamiento, plataforma, descripcion, precio, estado, rating, activo, fechaAcceso, version) {
        //llamar al super del constructor del videojuego
        super(id, título, genero, desarrollador, añoLanzamiento, plataforma, descripcion, precio, estado, rating, activo);
        this.fechaAcceso = fechaAcceso;
        this.version = version;
        this.feedback = [];
    }
    // ================== GETTERS Y SETTERS ==================
    getFechaAcceso() { return this.fechaAcceso; }
    setFechaAcceso(fecha) { this.fechaAcceso = fecha; }
    getVersion() { return this.version; }
    setVersion(version) { this.version = version; }
    // ================== MÉTODOS EXTRA ==================
    // Agregar un comentario de feedback de un usuario a la lista
    agregarFeedback(comentario) {
        this.feedback.push(comentario);
    }
    // Retorno todos los comentarios de feedback registrados
    obtenerFeedback() {
        return this.feedback;
    }
    // Sobrescribir el método de Videojuego para mostrar también la info de la beta
    mostrarEspecificaciones() {
        super.mostrarEspecificaciones();
        console.log(` Información Beta:
        Versión Beta: ${this.version}
        Fecha de acceso anticipado: ${this.fechaAcceso}
        `);
    }
}
//# sourceMappingURL=VideoJuegoBeta.js.map