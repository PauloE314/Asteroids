import GameError, { errCodes } from "../core/Errors.js";

class ErrorHandler {
    /**
     * Handles all game errors
     * @param {GameError} err
     */
    handle(err) {
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
}

export default new ErrorHandler();
