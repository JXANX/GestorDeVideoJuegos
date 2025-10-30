export class Videojuego {
    // ================== CONSTRUCTOR ==================
    // Se encarga de inicializar los atributos del videojuego cuando se crea un objeto
    constructor(id, título, genero, desarrollador, añoLanzamiento, plataforma, descripcion, precio, estado, rating, activo) {
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
    getId() { return this.id; }
    setId(id) { this.id = id; }
    getTítulo() { return this.título; }
    setTítulo(título) { this.título = título; }
    getGenero() { return this.genero; }
    setGenero(genero) { this.genero = genero; }
    getDesarrollador() { return this.desarrollador; }
    setDesarrollador(desarrollador) { this.desarrollador = desarrollador; }
    getAñoLanzamiento() { return this.añoLanzamiento; }
    setAñoLanzamiento(añoLanzamiento) { this.añoLanzamiento = añoLanzamiento; }
    getPlataforma() { return this.plataforma; }
    setPlataforma(plataforma) { this.plataforma = plataforma; }
    getDescripcion() { return this.descripcion; }
    setDescripcion(descripcion) { this.descripcion = descripcion; }
    getPrecio() { return this.precio; }
    setPrecio(precio) { this.precio = precio; }
    getEstado() { return this.estado; }
    setEstado(estado) { this.estado = estado; }
    getRating() { return this.rating; }
    setRating(rating) { this.rating = rating; }
    getActivo() { return this.activo; }
    setActivo(activo) { this.activo = activo; }
    // ================== MÉTODOS EXTRA ==================
    // Muestra toda la info del videojuego en consola de forma ordenada
    mostrarEspecificaciones() {
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
