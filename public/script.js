import runGame from "../src/index.js";

const HTMLPage = document.getElementById("page");
const HTMLPlayButton = document.getElementById("play");

HTMLPlayButton.onclick = () => {
    HTMLPage.classList.add("in-game");
    runGame()
        .then(() => {
            HTMLPage.classList.remove("in-game");
        })
        .catch(() => {
            HTMLPage.classList.remove("in-game");
        });
};

// HTMLPlayButton.click();
