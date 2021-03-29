import Game from "./core/Game.js";
import validator from "./core/Validator.js";

let game;

/**
 * Application's entry point
 */
export default function runGame() {
    return new Promise((resolve, reject) => {
        if (!game) {
            try {
                // Asserts game settings
                validator.assertValid();

                // Creates game instance
                game = new Game();
                game.init();
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
            reject();
        }
    });
}
