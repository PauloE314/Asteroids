import Game from "../src/Game.js";
import SETTINGS from "../src/core/settings.js";
import { handleErr } from "../src/core/errors.js";
import { getPlatform } from "../src/utils/index.js";

const HTMLPage = document.getElementById("page");
const HTMLPlayButton = document.getElementById("play");
const HTMLPltfErrorMessage = document.getElementById("pltf-error");
const HTMLGmErrorMessage = document.getElementById("gm-error");
const HTMLGmOverElement = document.getElementById("gm-over");
const HTMLCongratulationsElement = document.getElementById("congratulations");
const HTMLTryAgainElement = document.getElementById("restart");
const HTMLHomeElement = document.getElementById("home");
const platform = getPlatform();

let game;
let canPlay = true;

// Checks the platform  (TEMP)
if (platform != SETTINGS.PLATFORMS.desktop) {
  HTMLPltfErrorMessage.style.display = "block";
  HTMLPlayButton.style.display = "none";
  canPlay = false;
}

// Enables game start
if (canPlay) {
  HTMLPlayButton.onclick = () => {
    HTMLPage.classList.add("in-game");
    try {
      // Creates game instance
      game = new Game();

      // Shows game over element when player's life end
      game.onGameOver = (recordBreak) => {
        HTMLGmOverElement.style.display = "flex";

        if (recordBreak) HTMLCongratulationsElement.style.display = "inline";
        else HTMLCongratulationsElement.style.display = "none";
      };

      // Runs application
      game.run();

      // Try again
      HTMLTryAgainElement.onclick = () => {
        HTMLGmOverElement.style.display = "none";

        game.reset();
      };

      // Home link
      HTMLHomeElement.onclick = () => {
        HTMLGmOverElement.style.display = "none";
        HTMLPage.classList.remove("in-game");
        game.end();

        game = null;
      };

      // Catches game errors
    } catch (err) {
      HTMLPage.classList.remove("in-game");
      handleErr(game, HTMLGmErrorMessage);

      game = null;
      console.log(err);
    }
  };

  HTMLPlayButton.click();
}
