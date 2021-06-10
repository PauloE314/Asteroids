import { SETTINGS } from "./core/Game.js";

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
   * @param {score: Number, seconds: Number, player: Player asteroids: Asteroid[]} state
   */
  render(state) {
    this.clear();

    // Renders score
    this.ctx.font = `20px 'Press Start 2P'`;
    this.ctx.fillStyle = "white";
    this.ctx.textAlign = "end";
    this.ctx.fillText(
      `SCORE: ${state.score}   TIME: ${state.seconds}`,
      this.cvW - 20,
      40
    );

    // Renders entities
    this.ctx.lineWidth = 1;

    // Scales size
    this.ctx.save();
    this.ctx.scale(this.ratio, this.ratio);
    state.player.draw(this.ctx);
    state.asteroids.forEach((a) => a.draw(this.ctx));
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

    const size = Math.min(bound.height * SETTINGS.virtual.p, bound.width);
    this.cvH = size / SETTINGS.virtual.p;
    this.cvW = size;
    this.HTMLCanvas.width = this.cvW;
    this.HTMLCanvas.height = this.cvH;

    this.ratio = this.cvH / SETTINGS.virtual.h;
  }

  /**
   * Ends redering
   */
  end() {
    window.removeEventListener("resize", this.screenResize);
  }
}

export default Renderer;
