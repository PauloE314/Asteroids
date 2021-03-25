import Renderer from "../renderer/Renderer.js";

class Game {
    renderer = new Renderer();
    onEnd = function () {};

    /**
     * Initialize dependencies
     */
    init() {
        this.renderer.init();
    }

    /**
     * Main game loop
     */
    run(dt) {
        requestAnimationFrame(this.run.bind(this));
        this.renderer.renderState();
    }

    /**
     * Stops game
     */
    end(id) {
        cancelAnimationFrame(id);
        this.onEnd();
    }
}

export default Game;
