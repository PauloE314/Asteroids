import Game, { SETTINGS } from "../src/core/Game.js";
import { handleErr } from "../src/core/Errors.js";
import { getPlatform } from "../src/utils.js";

const HTMLPage = document.getElementById("page");
const HTMLPlayButton = document.getElementById("play");
const HTMLPltfErrorMessage = document.getElementById("pltf-error");
const platform = getPlatform();

let game;

// Checks the platform  (TEMP)
if (platform != SETTINGS.platform.desktop) {
    HTMLPltfErrorMessage.style.display = "block";
    HTMLPlayButton.style.display = "none";
}
// Enables game start
else {
    HTMLPlayButton.onclick = () => {
        HTMLPage.classList.add("in-game");
        try {
            // Creates game instance
            game = new Game();
            game.init(platform);
            game.onEnd = () => {
                game = null;
                HTMLPage.classList.remove("in-game");
            };

            // Runs application
            game.run();

            // Catches game errors
        } catch (err) {
            HTMLPage.classList.remove("in-game");
            handleErr(err);
        }
    };

    HTMLPlayButton.click();
}
