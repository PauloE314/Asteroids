export const errCodes = {
    unknownError: [0, "Default Error"],
    platformError: [1, "Platform Error"],
    inGameError: [2, "In Game Error"],
};

/**
 * Default game error
 */
export default class GameError extends Error {
    /**
     * Constructs a game error
     * @param {[number, string]} code
     * @param {string} message
     */
    constructor(code, message = "Game error") {
        super();
        this.message = message;
        this.name = code[1];
        this.code = code[0];
    }
}

/**
 * Handles all game errors
 * @param {GameError} err
 */
export function handleErr(err) {
    switch (err.code) {
        case errCodes.inGameError[0]:
            alert("O jogo já está ocorrendo");
            break;
        case errCodes.platformError[0]:
            alert("O jogo não está disponível para a sua plataforma");
            break;
        default:
            alert("Um erro desconhecido ocorreu");
            break;
    }
}
