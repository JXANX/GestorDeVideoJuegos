export class Videojuego {
    // ================== ATRIBUTOS ==================
    private id: number;                // Identificador único del videojuego
    private título: string;            // Nombre o título del juego
    private genero: string;            // Género (acción, aventura, etc.)
    private desarrollador: string;     // Empresa o persona que desarrolló el juego
    private añoLanzamiento: number;    // Año en que salió al mercado
    private plataforma: string;        // Consola o dispositivo en que se puede jugar
    private descripcion: string;       // Breve descripción del videojuego
    private precio: number;            // Precio del videojuego
    private estado: string;            // Estado (nuevo, usado, digital, etc.)
    private rating: number;            // Puntuación del 1 al 10
    private activo: boolean;           // Indica si el juego está activo o disponible

    // ================== CONSTRUCTOR ==================
    // Se encarga de inicializar los atributos del videojuego cuando se crea un objeto
    constructor(
        id: number, título: string, genero: string, desarrollador: string,
        añoLanzamiento: number, plataforma: string, descripcion: string,
        precio: number, estado: string, rating: number, activo: boolean
    ){
        this.id = id;
        this.título = título;   
        this.genero = genero;
        this.desarrollador = desarrollador;
        this.añoLanzamiento = añoLanzamiento;
        this.plataforma = plataforma;
        this.descripcion = descripcion;
        this.precio = precio;
        this.estado = estado;
        this.rating = rating;
        this.activo = activo;
    }
    
    // ================== GETTERS Y SETTERS ==================
    // Métodos para acceder y modificar los atributos privados

    public getId(): number { return this.id; }
    public setId(id: number): void { this.id = id; }

    public getTítulo(): string { return this.título; }
    public setTítulo(título: string): void { this.título = título; }

    public getGenero(): string { return this.genero; }
    public setGenero(genero: string): void { this.genero = genero; }

    public getDesarrollador(): string { return this.desarrollador; }
    public setDesarrollador(desarrollador: string): void { this.desarrollador = desarrollador; }

    public getAñoLanzamiento(): number { return this.añoLanzamiento; }
    public setAñoLanzamiento(añoLanzamiento: number): void { this.añoLanzamiento = añoLanzamiento; }

    public getPlataforma(): string { return this.plataforma; }
    public setPlataforma(plataforma: string): void { this.plataforma = plataforma; }

    public getDescripcion(): string { return this.descripcion; }
    public setDescripcion(descripcion: string): void { this.descripcion = descripcion; }

    public getPrecio(): number { return this.precio; }
    public setPrecio(precio: number): void { this.precio = precio; }

    public getEstado(): string { return this.estado; }
    public setEstado(estado: string): void { this.estado = estado; }

    public getRating(): number { return this.rating; }
    public setRating(rating: number): void { this.rating = rating; }

    public getActivo(): boolean { return this.activo; }
    public setActivo(activo: boolean): void { this.activo = activo; }

    // ================== MÉTODOS EXTRA ==================
    // Muestra toda la info del videojuego en consola de forma ordenada
    public mostrarEspecificaciones(): void {
        console.log(`🎮 Especificaciones del videojuego:
        ID: ${this.id}
        Título: ${this.título}
        Género: ${this.genero}
        Desarrollador: ${this.desarrollador}
        Año de lanzamiento: ${this.añoLanzamiento}
        Plataforma: ${this.plataforma}
        Descripción: ${this.descripcion}
        Precio: $${this.precio}
        Estado: ${this.estado}
        Rating: ${this.rating}/10
        Activo: ${this.activo ? "Sí" : "No"}
        `);
    }
}
