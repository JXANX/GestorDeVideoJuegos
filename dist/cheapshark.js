const CHEAPSHARK_URL = "https://www.cheapshark.com/api/1.0";
// ================== FUNCIONES DE LA API ==================
/**
 * Busca juegos por nombre
 * @param titulo - Nombre del juego a buscar
 * @returns Promise con array de juegos encontrados
 */
export async function buscarJuegoPorNombre(titulo) {
    try {
        if (!titulo || titulo.trim() === "") {
            console.warn("Título de búsqueda vacío");
            return [];
        }
        const response = await fetch(`${CHEAPSHARK_URL}/games?title=${encodeURIComponent(titulo)}&limit=15`);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();
        console.log(`Búsqueda CheapShark "${titulo}":`, data.length, "resultados");
        return data;
    }
    catch (error) {
        console.error("Error al buscar en CheapShark:", error);
        return [];
    }
}
/**
 * Obtiene detalles y ofertas de un juego específico
 * @param gameID - ID del juego en CheapShark
 * @returns Promise con detalles del juego y sus ofertas
 */
export async function obtenerDetallesJuego(gameID) {
    try {
        const response = await fetch(`${CHEAPSHARK_URL}/games?id=${gameID}`);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();
        console.log("Detalles del juego obtenidos:", data.info.title);
        return data;
    }
    catch (error) {
        console.error("Error al obtener detalles:", error);
        return null;
    }
}
/**
 * Obtiene las mejores ofertas actuales
 * @param limite - Número de ofertas a obtener (máx 60)
 * @returns Promise con array de ofertas
 */
export async function obtenerMejoresOfertas(limite = 20) {
    try {
        const response = await fetch(`${CHEAPSHARK_URL}/deals?sortBy=Savings&pageSize=${limite}`);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();
        console.log("Mejores ofertas obtenidas:", data.length);
        return data;
    }
    catch (error) {
        console.error("Error al obtener ofertas:", error);
        return [];
    }
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
//# sourceMappingURL=cheapshark.js.map