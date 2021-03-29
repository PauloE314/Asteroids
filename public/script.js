import runGame from "../src/index.js";
import errorHandler from "../src/exceptions/Handler.js";
import validator from "../src/core/Validator.js";

const HTMLPage = document.getElementById("page");
const HTMLPlayButton = document.getElementById("play");
const HTMLPltfErrorMessage = document.getElementById("pltf-error");

// Checks the platform
if (!validator.isDesktop(false)) {
    HTMLPltfErrorMessage.style.display = "block";
    HTMLPlayButton.style.display = "none";
}
// Enables game start
else {
    HTMLPlayButton.onclick = () => {
        HTMLPage.classList.add("in-game");
        runGame()
            .then(() => {
                HTMLPage.classList.remove("in-game");
            })
            .catch((err) => {
                HTMLPage.classList.remove("in-game");
                errorHandler.handle(err);
            });
    };

    HTMLPlayButton.click();
}
