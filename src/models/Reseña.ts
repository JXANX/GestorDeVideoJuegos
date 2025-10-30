export class Reseña {
    // ================== ATRIBUTOS ==================
    private idReseña: number;     // identificador único de la reseña
    private usuario: string;      // nombre del usuario que hizo la reseña
    private comentario: string;   // texto del comentario
    private calificacion: number; // nota que le dio el usuario
    private fecha: string;        // fecha en la que se hizo la reseña
    private activo: boolean;      // indica si la reseña está activa o no

    // ================== CONSTRUCTOR ==================
    constructor(idReseña: number, usuario: string, comentario: string, calificacion: number, fecha: string, activo: boolean) {
        this.idReseña = idReseña;
        this.usuario = usuario;
        this.comentario = comentario;
        this.calificacion = calificacion;
        this.fecha = fecha;
        this.activo = activo;
    }

    // ================== GETTERS Y SETTERS ==================

    // ID
    public getIdReseña(): number { return this.idReseña; }
    public setIdReseña(idReseña: number): void { this.idReseña = idReseña; }

    // Usuario
    public getUsuario(): string { return this.usuario; }
    public setUsuario(usuario: string): void { this.usuario = usuario; }

    // Comentario
    public getComentario(): string { return this.comentario; }
    public setComentario(comentario: string): void { this.comentario = comentario; }

    // Calificación
    public getCalificacion(): number { return this.calificacion; }
    public setCalificacion(calificacion: number): void { this.calificacion = calificacion; }

    // Fecha
    public getFecha(): string { return this.fecha; }
    public setFecha(fecha: string): void { this.fecha = fecha; }

    // Estado activo
    public getActivo(): boolean { return this.activo; }
    public setActivo(activo: boolean): void { this.activo = activo; }

    // ================== MÉTODOS EXTRA ==================
    
    // Muestra la reseña completa en consola
    public mostrarReseña(): void {
        console.log(`
        📌 Reseña #${this.idReseña}
        Usuario: ${this.usuario}
        Fecha: ${this.fecha}
        Calificación: ${this.calificacion}/10
        Comentario: "${this.comentario}"
        `);
    }
}
