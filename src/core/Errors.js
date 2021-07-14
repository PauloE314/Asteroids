import Game from "../Game.js";

/**
 * @param {Game} game
 * @param {HTMLSpanElement} htmlErrorElement
 * @param {string} message
 */
export function handleErr(game, htmlErrorElement, message) {
  message = message ? message : "An unknown error has occured";
  message = `An unknown error has occured<br/>'${message}'<br/>`;

  // Ends game
  if (game) game.end();

  htmlErrorElement.style.display = "block";
  htmlErrorElement.innerHTML = `${message}<br/> Reloading page in 3`;

  // Shows error message with regressive counting
  let i = 2;
  const id = setInterval(() => {
    htmlErrorElement.innerHTML = `${message}<br/> Reloading page in ${i}`;
    i--;

    if (i < 0) {
      clearInterval(id);
      window.location.reload();
    }
  }, 1500);
}
