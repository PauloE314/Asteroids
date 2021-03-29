import Game from "./core/Game.js";
import validator from "./core/Validator.js";
import GameError, { errCodes } from "./core/Errors.js";

let game;

/**
 * Application's entry point
 */
export default function runGame() {
    return new Promise(async (resolve, reject) => {
        if (!game) {
            try {
                // Asserts game settings
                validator.assertValid();

                // Creates game instance
                game = new Game();
                await game.init();

                game.onEnd = () => {
                    game = null;
                    resolve();
                };

                // Runs application
                game.run();

                // Catches game errors
            } catch (error) {
                reject(error);
            }
        } else {
            reject(new GameError(errCodes.inGameError));
        }
    });
}
