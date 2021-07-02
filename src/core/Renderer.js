import SETTINGS from "./settings.js";
import Player from "../entities/Player.js";
import Asteroid from "../entities/Asteroid.js";

const { VIRTUAL } = SETTINGS;

class Renderer {
  HTMLCanvas = null;
  HTMLCvContainer = null;
  ctx = null;

  cvW = 0;
  cvH = 0;
  ratio = 1;

  /**
   * Loads renderer
   */
  init() {
    this.HTMLCanvas = document.getElementById("cv");
    this.HTMLCvContainer = document.querySelector("main");
    this.ctx = this.HTMLCanvas.getContext("2d");

    this.screenResize = this.screenResize.bind(this);
    this.screenResize();
    window.addEventListener("resize", this.screenResize);
  }

  /**
   * Renders state on canvas
   * @param {{life_count: Number, score: Number, seconds: Number, player: Player, asteroids: Asteroid[]}} state
   */
  render(state) {
    if (state.seconds < 10) state.seconds = "0" + state.seconds;

    this.clear();

    // Renders score
    this.ctx.font = `20px 'Press Start 2P'`;
    this.ctx.fillStyle = "white";
    this.ctx.textAlign = "end";
    this.ctx.fillText(
      `LIFE: ${state.life_count}   SCORE: ${state.score}   TIME: ${state.seconds}`,
      this.cvW - 20,
      40
    );

    // Renders entities
    this.ctx.lineWidth = 1;

    // Scales size
    this.ctx.save();
    this.ctx.scale(this.ratio, this.ratio);

    state.asteroids.forEach((a) => a.render(this.ctx));
    state.player.render(this.ctx);

    this.ctx.restore();
  }

  /**
   * Clears canvas screen
   */
  clear() {
    this.ctx.fillStyle = "black";
    this.ctx.strokeStyle = "white";
    this.ctx.lineWidth = 5;
    this.ctx.fillRect(0, 0, this.cvW, this.cvH);
    this.ctx.strokeRect(0, 0, this.cvW, this.cvH);
  }

  /**
   * Handles screen resize
   */
  screenResize() {
    const bound = this.HTMLCvContainer.getBoundingClientRect();

    const size = Math.min(bound.height * VIRTUAL.p, bound.width);
    this.cvH = size / VIRTUAL.p;
    this.cvW = size;
    this.HTMLCanvas.width = this.cvW;
    this.HTMLCanvas.height = this.cvH;

    this.ratio = this.cvH / VIRTUAL.h;
  }

  /**
   * Ends rendering
   */
  end() {
    window.removeEventListener("resize", this.screenResize);
  }
}

export default Renderer;
