import { getSmaller } from "../math/index.js";

class Renderer {
    HTMLCanvas = null;
    HTMLCvContainer = null;

    cvW = 0;
    cvH = 0;

    /**
     * Loads renderer
     */
    init() {
        this.HTMLCanvas = document.getElementById("cv");
        this.HTMLCvContainer = document.querySelector("main");
        this.screenResize();
        window.addEventListener("resize", () => {
            this.screenResize();
        });
    }

    /**
     * Renders state on canvas
     * @param {*} state
     */
    renderState(state) {}

    /**
     * Handles screen resize
     */
    screenResize() {
        const bound = this.HTMLCvContainer.getBoundingClientRect();
        const size = getSmaller(bound.height * 1.5, bound.width);

        this.HTMLCanvas.style.height = `${size / 1.5}px`;
        this.HTMLCanvas.style.width = `${size}px`;
    }
}

export default Renderer;
