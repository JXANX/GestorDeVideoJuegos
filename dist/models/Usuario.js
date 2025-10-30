export class Usuario {
    // Constructor para inicializar los datos de cada usuario
    constructor(idUsuario, nombre, correo, contraseña, activo) {
        this.idUsuario = idUsuario;
        this.nombre = nombre;
        this.correo = correo;
        this.contraseña = contraseña;
        this.activo = activo;
    }
    // ================== GETTERS Y SETTERS ==================
    // Sirven para acceder y modificar los atributos privados
    getIdUsuario() { return this.idUsuario; }
    setIdUsuario(idUsuario) { this.idUsuario = idUsuario; }
    getNombre() { return this.nombre; }
    setNombre(nombre) { this.nombre = nombre; }
    getCorreo() { return this.correo; }
    setCorreo(correo) { this.correo = correo; }
    getContraseña() { return this.contraseña; }
    setContraseña(contraseña) { this.contraseña = contraseña; }
    getActivo() { return this.activo; }
    setActivo(activo) { this.activo = activo; }
    // ================== MÉTODOS EXTRA ==================
    // Muestra la info del usuario en consola
    mostrarInfo() {
        console.log(`
        👤 Usuario #${this.idUsuario}
        Nombre: ${this.nombre}
        Correo: ${this.correo}
        Estado: ${this.activo ? "Activo" : "Inactivo"}
        `);
    }
    // Método para iniciar sesión validando correo, contraseña y estado activo
    iniciarSesion(correo, contraseña) {
        if (this.correo === correo && this.contraseña === contraseña && this.activo) {
            console.log(`Bienvenido ${this.nombre}`);
            return true;
        }
        console.log("⚠️ Credenciales inválidas o cuenta inactiva.");
        return false;
    }
    // Método para cambiar la contraseña del usuario
    cambiarContraseña(nuevaContraseña) {
        this.contraseña = nuevaContraseña;
        console.log("Contraseña actualizada con éxito.");
    }
}
