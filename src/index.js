import Game from "./core/Game.js";
import GameError, { errCodes } from "./core/Errors.js";

let game;

/**
 * Application's entry point
 * @param {Number} platform
 */
export default function runGame(platform) {
    return new Promise(async (resolve, reject) => {
        if (!game) {
            try {
                // Creates game instance
                game = new Game();
                await game.init(platform);

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
