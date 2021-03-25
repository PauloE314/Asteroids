import Game from "./core/Game.js";

let game;

/**
 * Application's entry point
 */
export default function runGame() {
    return new Promise((resolve, reject) => {
        if (!game) {
            game = new Game();
            game.init();
            game.onEnd = () => {
                game = null;
                resolve();
            };
            game.run();
        } else {
            reject();
        }
    });
}
