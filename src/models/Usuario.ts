export class Usuario {
    // Atributos privados del usuario
    private idUsuario: number;
    private nombre: string;
    private correo: string;
    private contraseña: string;
    private activo: boolean;

    // Constructor para inicializar los datos de cada usuario
    constructor(idUsuario: number, nombre: string, correo: string, contraseña: string, activo: boolean) {
        this.idUsuario = idUsuario;
        this.nombre = nombre;
        this.correo = correo;
        this.contraseña = contraseña;
        this.activo = activo;
    }

    // ================== GETTERS Y SETTERS ==================
    // Sirven para acceder y modificar los atributos privados

    public getIdUsuario(): number { return this.idUsuario; }
    public setIdUsuario(idUsuario: number): void { this.idUsuario = idUsuario; }

    public getNombre(): string { return this.nombre; }
    public setNombre(nombre: string): void { this.nombre = nombre; }

    public getCorreo(): string { return this.correo; }
    public setCorreo(correo: string): void { this.correo = correo; }

    public getContraseña(): string { return this.contraseña; }
    public setContraseña(contraseña: string): void { this.contraseña = contraseña; }

    public getActivo(): boolean { return this.activo; }
    public setActivo(activo: boolean): void { this.activo = activo; }

    // ================== MÉTODOS EXTRA ==================

    // Muestra la info del usuario en consola
    public mostrarInfo(): void {
        console.log(`
        👤 Usuario #${this.idUsuario}
        Nombre: ${this.nombre}
        Correo: ${this.correo}
        Estado: ${this.activo ? "Activo" : "Inactivo"}
        `);
    }

    // Método para iniciar sesión validando correo, contraseña y estado activo
    public iniciarSesion(correo: string, contraseña: string): boolean {
        if (this.correo === correo && this.contraseña === contraseña && this.activo) {
            console.log(`Bienvenido ${this.nombre}`);
            return true;
        }
        console.log("⚠️ Credenciales inválidas o cuenta inactiva.");
        return false;
    }

    // Método para cambiar la contraseña del usuario
    public cambiarContraseña(nuevaContraseña: string): void {
        this.contraseña = nuevaContraseña;
        console.log("Contraseña actualizada con éxito.");
    }
}
