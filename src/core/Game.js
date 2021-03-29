import Renderer from "../renderer/Renderer.js";
import { Player } from "./Entities.js";

export default class Game {
    renderer = new Renderer();
    score = 0;
    start = null;
    state = {
        score: 0,
        time: 0,
        entities: [],
    };

    player = new Player();
    asteroids = [];

    onEnd = function () {};

    /**
     * Initialize dependencies
     */
    async init() {
        this.renderer.init();
        this.player.init();

        this.state.score = 0;
        this.start = Date.now();
    }

    /**
     * Main game loop
     */
    run(dt) {
        // Gets game loop
        requestAnimationFrame(this.run.bind(this));

        this.state.entities = [this.player];
        this.state.time = ((Date.now() - this.start) / 1000).toFixed(0);

        this.state.entities.forEach((e) => e.update(dt));
        this.renderer.renderState(this.state);

        /*
        var interval = setInterval(function() {
            var elapsedTime = Date.now() - startTime;
            document.getElementById("timer").innerHTML = (elapsedTime / 1000).toFixed(3);
        }, 100);
        */
    }

    /**
     * Stops game
     */
    end(id) {
        cancelAnimationFrame(id);
        this.onEnd();
    }
}
