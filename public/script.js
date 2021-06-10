import Game from "../src/core/Game.js";
import SETTINGS from "../src/settings.js";
import { handleErr } from "../src/core/errors.js";
import { getPlatform } from "../src/utils/index.js";

const HTMLPage = document.getElementById("page");
const HTMLPlayButton = document.getElementById("play");
const HTMLPltfErrorMessage = document.getElementById("pltf-error");
const HTMLGmErrorMessage = document.getElementById("gm-error");
const platform = getPlatform();

let game;

// Checks the platform  (TEMP)
if (platform != SETTINGS.PLATFORMS.desktop) {
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
      game.init(platform, HTMLGmErrorMessage);
      game.onEnd = () => {
        game = null;
        // HTMLPage.classList.remove("in-game");
      };

      // Runs application
      game.run();

      // Catches game errors
    } catch (err) {
      HTMLPage.classList.remove("in-game");
      handleErr(game, HTMLGmErrorMessage);
      game = null;
    }
  };

  HTMLPlayButton.click();
}
