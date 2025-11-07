var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from "axios";
const API_URL = "https://api.rawg.io/api";
const API_KEY = "1724bff304ea4659b952fddb50e807de";
/**
 * Obtiene los juegos más populares (mejor valorados)
 * @returns Promise con array de juegos
 */
export function obtenerJuegosPopulares() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios.get(`${API_URL}/games`, {
                params: {
                    key: API_KEY,
                    ordering: "-rating",
                    page_size: 20 // Aumentado a 20 para más resultados
                }
            });
            console.log("Juegos populares obtenidos:", response.data.results.length);
            return response.data.results;
        }
        catch (error) {
            console.error("Error al obtener juegos populares:", error);
            return [];
        }
    });
}
/**
 * Busca juegos por nombre
 * @param nombre - Nombre del juego a buscar
 * @returns Promise con array de juegos encontrados
 */
export function buscarJuego(nombre) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!nombre || nombre.trim() === "") {
                console.warn("Nombre de búsqueda vacío");
                return [];
            }
            const response = yield axios.get(`${API_URL}/games`, {
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
    });
}
/**
 * Busca juegos por género
 * @param genero - Género a buscar (ej: "action", "rpg", "adventure")
 * @returns Promise con array de juegos del género especificado
 */
export function buscarJuegoPorGenero(genero) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!genero || genero.trim() === "") {
                console.warn("Género de búsqueda vacío");
                return [];
            }
            const response = yield axios.get(`${API_URL}/games`, {
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
    });
}
/**
 * Busca juegos por plataforma
 * @param plataforma - ID o slug de la plataforma (ej: "4" para PC, "187" para PS5)
 * @returns Promise con array de juegos de la plataforma
 */
export function buscarJuegoPorPlataforma(plataforma) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!plataforma || plataforma.trim() === "") {
                console.warn("Plataforma de búsqueda vacía");
                return [];
            }
            const response = yield axios.get(`${API_URL}/games`, {
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
    });
}
/**
 * Obtiene juegos nuevos/recientes
 * @returns Promise con array de juegos recientes
 */
export function obtenerJuegosRecientes() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const fechaActual = new Date();
            const hace30Dias = new Date(fechaActual.setDate(fechaActual.getDate() - 30));
            const fechaFormato = hace30Dias.toISOString().split('T')[0]; // YYYY-MM-DD
            const response = yield axios.get(`${API_URL}/games`, {
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
    });
}
/**
 * Busca juegos con filtros múltiples
 * @param filtros - Objeto con filtros opcionales
 * @returns Promise con array de juegos filtrados
 */
export function buscarJuegosConFiltros(filtros) {
    return __awaiter(this, void 0, void 0, function* () {
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
            const response = yield axios.get(`${API_URL}/games`, {
                params
            });
            console.log("Búsqueda con filtros:", response.data.results.length, "resultados");
            return response.data.results;
        }
        catch (error) {
            console.error("Error al buscar con filtros:", error);
            return [];
        }
    });
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
