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
