import Game from "../src/Game.js";
import SETTINGS from "../src/core/settings.js";
import { handleErr } from "../src/core/errors.js";
import { getPlatform } from "../src/utils/index.js";

const HTMLPage = document.getElementById("page");
const HTMLPlayButton = document.getElementById("play");
const HTMLPltfErrorMessage = document.getElementById("pltf-error");
const HTMLGmErrorMessage = document.getElementById("gm-error");
const HTMLGmOverElement = document.getElementById("gm-over");
const HTMLTryAgainElement = document.getElementById("restart");
const HTMLHomeElement = document.getElementById("home");
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
      game = new Game(platform, HTMLGmErrorMessage, HTMLGmOverElement);

      // Runs application
      game.run();

      // Try again
      HTMLTryAgainElement.onclick = () => {
        HTMLGmOverElement.style.display = "none";
        game.reset();
      };

      // Home link
      HTMLHomeElement.onclick = () => {
        HTMLPage.classList.remove("in-game");
        game = null;
      };

      // Catches game errors
    } catch (err) {
      console.log(err);
      HTMLPage.classList.remove("in-game");
      handleErr(game, HTMLGmErrorMessage);
      game = null;
    }
  };

  HTMLPlayButton.click();
}
