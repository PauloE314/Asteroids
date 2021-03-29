import { getSmaller } from "../math/index.js";

const font = "Press Start 2P";

class Renderer {
    HTMLCanvas = null;
    HTMLCvContainer = null;
    ctx = null;

    cvW = 0;
    cvH = 0;

    /**
     * Loads renderer
     */
    init() {
        this.HTMLCanvas = document.getElementById("cv");
        this.HTMLCvContainer = document.querySelector("main");
        this.ctx = this.HTMLCanvas.getContext("2d");

        this.screenResize();
        window.addEventListener("resize", () => {
            this.screenResize();
        });
    }

    /**
     * Renders state on canvas
     * @param {*} state
     */
    renderState(state) {
        this.clear();

        // Renders score
        this.ctx.font = `20px 'Press Start 2P'`;
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "end";
        this.ctx.fillText(
            `SCORE: ${state.score}   TIME: ${state.time}`,
            this.cvW - 20,
            40
        );
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
        const size = getSmaller(bound.height * 1.5, bound.width);
        this.cvH = size / 1.5;
        this.cvW = size;
        this.HTMLCanvas.width = this.cvW;
        this.HTMLCanvas.height = this.cvH;
    }
}

export default Renderer;
