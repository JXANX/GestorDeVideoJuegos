var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const CHEAPSHARK_URL = "https://www.cheapshark.com/api/1.0";
// ================== FUNCIONES DE LA API ==================
/**
 * Busca juegos por nombre
 * @param titulo - Nombre del juego a buscar
 * @returns Promise con array de juegos encontrados
 */
export function buscarJuegoPorNombre(titulo) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!titulo || titulo.trim() === "") {
                console.warn("Título de búsqueda vacío");
                return [];
            }
            const response = yield fetch(`${CHEAPSHARK_URL}/games?title=${encodeURIComponent(titulo)}&limit=15`);
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            const data = yield response.json();
            console.log(`Búsqueda CheapShark "${titulo}":`, data.length, "resultados");
            return data;
        }
        catch (error) {
            console.error("Error al buscar en CheapShark:", error);
            return [];
        }
    });
}
/**
 * Obtiene detalles y ofertas de un juego específico
 * @param gameID - ID del juego en CheapShark
 * @returns Promise con detalles del juego y sus ofertas
 */
export function obtenerDetallesJuego(gameID) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`${CHEAPSHARK_URL}/games?id=${gameID}`);
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            const data = yield response.json();
            console.log("Detalles del juego obtenidos:", data.info.title);
            return data;
        }
        catch (error) {
            console.error("Error al obtener detalles:", error);
            return null;
        }
    });
}
/**
 * Obtiene las mejores ofertas actuales
 * @param limite - Número de ofertas a obtener (máx 60)
 * @returns Promise con array de ofertas
 */
export function obtenerMejoresOfertas() {
    return __awaiter(this, arguments, void 0, function* (limite = 20) {
        try {
            const response = yield fetch(`${CHEAPSHARK_URL}/deals?sortBy=Savings&pageSize=${limite}`);
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            const data = yield response.json();
            console.log("Mejores ofertas obtenidas:", data.length);
            return data;
        }
        catch (error) {
            console.error("Error al obtener ofertas:", error);
            return [];
        }
    });
}
/**
 * Nombres de las tiendas en CheapShark
 */
export const TIENDAS_CHEAPSHARK = {
    "1": "Steam",
    "2": "GamersGate",
    "3": "GreenManGaming",
    "7": "GOG",
    "8": "Origin",
    "11": "Humble Store",
    "13": "Uplay",
    "15": "Fanatical",
    "25": "Epic Games Store",
    "27": "Gamesplanet",
    "28": "Gamesload",
    "29": "2Game",
    "30": "IndieGala",
    "31": "Blizzard Shop",
    "33": "DLGamer",
    "34": "Noctre",
    "35": "DreamGame"
};
