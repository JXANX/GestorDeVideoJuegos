import { Videojuego } from "./Videojuego.js";

export class VideojuegoBeta extends Videojuego {
    // ================== ATRIBUTOS EXTRA ==================
    private fechaAcceso: string;   // Fecha en que el usuario pudo acceder a la beta
    private version: string;       // Versión de la beta (ej: 0.9, 1.0 beta, etc.)
    private feedback: string[];    // Lista de comentarios de los jugadores en beta

    // ================== CONSTRUCTOR ==================
    // Inicializar tanto los atributos heredados de Videojuego como los propios de la beta
    constructor(
        id: number,
        título: string,
        genero: string,
        desarrollador: string,
        añoLanzamiento: number,
        plataforma: string,
        descripcion: string,
        precio: number,
        estado: string,
        rating: number,
        activo: boolean,
        fechaAcceso: string,
        version: string
    ) {
      //llamar al super del constructor del videojuego
        super(id, título, genero, desarrollador, añoLanzamiento, plataforma, descripcion, precio, estado, rating, activo);

        this.fechaAcceso = fechaAcceso;
        this.version = version;
        this.feedback = []; 
    }

    // ================== GETTERS Y SETTERS ==================
    public getFechaAcceso(): string { return this.fechaAcceso; }
    public setFechaAcceso(fecha: string): void { this.fechaAcceso = fecha; }

    public getVersion(): string { return this.version; }
    public setVersion(version: string): void { this.version = version; }

    // ================== MÉTODOS EXTRA ==================
    // Agregar un comentario de feedback de un usuario a la lista
    public agregarFeedback(comentario: string): void {
        this.feedback.push(comentario);
    }

    // Retorno todos los comentarios de feedback registrados
    public obtenerFeedback(): string[] {
        return this.feedback;
    }

    // Sobrescribir el método de Videojuego para mostrar también la info de la beta
    public mostrarEspecificaciones(): void {
        super.mostrarEspecificaciones(); 
        console.log(` Información Beta:
        Versión Beta: ${this.version}
        Fecha de acceso anticipado: ${this.fechaAcceso}
        `);
    }
}
