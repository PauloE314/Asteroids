import runGame from "../src/index.js";
import { SETTINGS } from "../src/core/Game.js";
import { handleErr } from "../src/core/Errors.js";
import { getPlatform } from "../src/utils/index.js";

const HTMLPage = document.getElementById("page");
const HTMLPlayButton = document.getElementById("play");
const HTMLPltfErrorMessage = document.getElementById("pltf-error");
const platform = getPlatform();

// TEMP
// Checks the platform
if (platform != SETTINGS.platform.desktop) {
    HTMLPltfErrorMessage.style.display = "block";
    HTMLPlayButton.style.display = "none";
}
// Enables game start
else {
    HTMLPlayButton.onclick = () => {
        HTMLPage.classList.add("in-game");
        runGame(platform)
            .then(() => {
                HTMLPage.classList.remove("in-game");
            })
            .catch((err) => {
                HTMLPage.classList.remove("in-game");
                handleErr(err);
            });
    };

    HTMLPlayButton.click();
}
