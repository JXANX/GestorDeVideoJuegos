export class Reseña {
    // ================== CONSTRUCTOR ==================
    constructor(idReseña, usuario, comentario, calificacion, fecha, activo) {
        this.idReseña = idReseña;
        this.usuario = usuario;
        this.comentario = comentario;
        this.calificacion = calificacion;
        this.fecha = fecha;
        this.activo = activo;
    }
    // ================== GETTERS Y SETTERS ==================
    // ID
    getIdReseña() { return this.idReseña; }
    setIdReseña(idReseña) { this.idReseña = idReseña; }
    // Usuario
    getUsuario() { return this.usuario; }
    setUsuario(usuario) { this.usuario = usuario; }
    // Comentario
    getComentario() { return this.comentario; }
    setComentario(comentario) { this.comentario = comentario; }
    // Calificación
    getCalificacion() { return this.calificacion; }
    setCalificacion(calificacion) { this.calificacion = calificacion; }
    // Fecha
    getFecha() { return this.fecha; }
    setFecha(fecha) { this.fecha = fecha; }
    // Estado activo
    getActivo() { return this.activo; }
    setActivo(activo) { this.activo = activo; }
    // ================== MÉTODOS EXTRA ==================
    // Muestra la reseña completa en consola
    mostrarReseña() {
        console.log(`
        📌 Reseña #${this.idReseña}
        Usuario: ${this.usuario}
        Fecha: ${this.fecha}
        Calificación: ${this.calificacion}/10
        Comentario: "${this.comentario}"
        `);
    }
}
//# sourceMappingURL=Rese%C3%B1a.js.map