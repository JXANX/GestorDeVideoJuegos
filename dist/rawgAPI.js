// rawgAPI.ts - Versión sin import axios (usa el global del CDN)
const API_URL = "https://api.rawg.io/api";
const API_KEY = "1724bff304ea4659b952fddb50e807de";
/**
 * Obtiene los juegos más populares (mejor valorados)
 */
export async function obtenerJuegosPopulares() {
    try {
        const response = await axios.get(`${API_URL}/games`, {
            params: {
                key: API_KEY,
                ordering: "-rating",
                page_size: 20
            }
        });
        console.log("Juegos populares obtenidos:", response.data.results.length);
        return response.data.results;
    }
    catch (error) {
        console.error("Error al obtener juegos populares:", error);
        return [];
    }
}
/**
 * Busca juegos por nombre
 */
export async function buscarJuego(nombre) {
    try {
        if (!nombre || nombre.trim() === "") {
            console.warn("Nombre de búsqueda vacío");
            return [];
        }
        const response = await axios.get(`${API_URL}/games`, {
            params: {
                key: API_KEY,
                search: nombre,
                page_size: 20
            }
        });
        console.log(`Búsqueda "${nombre}":`, response.data.results.length, "resultados");
        return response.data.results;
    }
    catch (error) {
        console.error("Error al buscar juego:", error);
        return [];
    }
}
/**
 * Busca juegos por género
 */
export async function buscarJuegoPorGenero(genero) {
    try {
        if (!genero || genero.trim() === "") {
            console.warn("Género de búsqueda vacío");
            return [];
        }
        const response = await axios.get(`${API_URL}/games`, {
            params: {
                key: API_KEY,
                genres: genero.toLowerCase(),
                page_size: 20,
                ordering: "-rating"
            }
        });
        console.log(`Género "${genero}":`, response.data.results.length, "resultados");
        return response.data.results;
    }
    catch (error) {
        console.error("Error al buscar por género:", error);
        return [];
    }
}
/**
 * Busca juegos por plataforma
 */
export async function buscarJuegoPorPlataforma(plataforma) {
    try {
        if (!plataforma || plataforma.trim() === "") {
            console.warn("Plataforma de búsqueda vacía");
            return [];
        }
        const response = await axios.get(`${API_URL}/games`, {
            params: {
                key: API_KEY,
                platforms: plataforma,
                page_size: 20,
                ordering: "-rating"
            }
        });
        console.log(`Plataforma "${plataforma}":`, response.data.results.length, "resultados");
        return response.data.results;
    }
    catch (error) {
        console.error("Error al buscar por plataforma:", error);
        return [];
    }
}
/**
 * Obtiene juegos nuevos/recientes
 */
export async function obtenerJuegosRecientes() {
    try {
        const fechaActual = new Date();
        const hace30Dias = new Date(fechaActual.setDate(fechaActual.getDate() - 30));
        const fechaFormato = hace30Dias.toISOString().split('T')[0];
        const response = await axios.get(`${API_URL}/games`, {
            params: {
                key: API_KEY,
                dates: `${fechaFormato},${new Date().toISOString().split('T')[0]}`,
                ordering: "-released",
                page_size: 20
            }
        });
        console.log("Juegos recientes obtenidos:", response.data.results.length);
        return response.data.results;
    }
    catch (error) {
        console.error("Error al obtener juegos recientes:", error);
        return [];
    }
}
/**
 * Busca juegos con filtros múltiples
 */
export async function buscarJuegosConFiltros(filtros) {
    try {
        const params = {
            key: API_KEY,
            page_size: 20,
            ordering: "-rating"
        };
        if (filtros.genero)
            params.genres = filtros.genero.toLowerCase();
        if (filtros.plataforma)
            params.platforms = filtros.plataforma;
        if (filtros.busqueda)
            params.search = filtros.busqueda;
        if (filtros.año) {
            params.dates = `${filtros.año}-01-01,${filtros.año}-12-31`;
        }
        const response = await axios.get(`${API_URL}/games`, {
            params
        });
        console.log("Búsqueda con filtros:", response.data.results.length, "resultados");
        return response.data.results;
    }
    catch (error) {
        console.error("Error al buscar con filtros:", error);
        return [];
    }
}
// ================== GÉNEROS COMUNES EN RAWG ==================
export const GENEROS_RAWG = [
    "action",
    "adventure",
    "rpg",
    "strategy",
    "shooter",
    "puzzle",
    "racing",
    "sports",
    "platformer",
    "fighting",
    "simulation",
    "arcade",
    "indie",
    "casual",
    "family",
    "educational",
    "board-games",
    "card"
];
// ================== IDS DE LAS PLATAFORMAS COMUNES ==================
export const PLATAFORMAS_RAWG = {
    PC: "4",
    PlayStation5: "187",
    PlayStation4: "18",
    XboxSeriesX: "186",
    XboxOne: "1",
    NintendoSwitch: "7",
    iOS: "3",
    Android: "21",
    macOS: "5",
    Linux: "6"
};
//# sourceMappingURL=rawgAPI.js.map