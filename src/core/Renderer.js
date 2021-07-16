import SETTINGS from "./settings.js";
import Player from "../entities/Player.js";
import Asteroid from "../entities/Asteroid.js";
import Entity from "../entities/Entities.js";

const { VIRTUAL } = SETTINGS;

/**
 * Renderer abstraction. This object is intended to render things on canvas e handle resize logic.
 */
class Renderer {
  HTMLCanvas = null;
  HTMLCvContainer = null;
  ctx = null;

  cvW = 0;
  cvH = 0;
  ratio = 1;

  constructor() {
    this.HTMLCanvas = document.getElementById("cv");
    this.HTMLCvContainer = document.querySelector("main");
    this.ctx = this.HTMLCanvas.getContext("2d");
  }

  /**
   * Initializes listeners
   */
  init() {
    this.screenResize = this.screenResize.bind(this);
    this.screenResize();
    window.addEventListener("resize", this.screenResize);
  }

  /**
   * Renders state on canvas
   * @param {{lifeCount: Number, score: Number, maxScore: Number, seconds: Number, entities: Entity[] } state
   */
  render(state) {
    if (state.seconds < 10) state.seconds = "0" + state.seconds;

    // Clears screen
    this.clear();

    // Renders score
    this.ctx.font = `20px 'Press Start 2P'`;
    this.ctx.fillStyle = "white";
    this.ctx.textAlign = "end";
    this.ctx.fillText(
      `LIFE: ${state.lifeCount}   SCORE: ${state.score}   MAX SCORE: ${state.maxScore}   TIME: ${state.seconds}`,
      this.cvW - 20,
      40
    );

    // Renders entities
    this.ctx.lineWidth = 1;

    // Scales size
    this.ctx.save();
    this.ctx.scale(this.ratio, this.ratio);
    state.entities.forEach((a) => a.render(this.ctx));
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
   * Applies filters in rendering
   * @param {String} filter
   */
  setFilter(filter) {
    this.filter = filter;
  }

  /**
   * Ends rendering
   */
  end() {
    window.removeEventListener("resize", this.screenResize);
  }
}

export default Renderer;
