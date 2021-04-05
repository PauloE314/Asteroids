import Renderer from "../renderer/Renderer.js";
import Settings from "./Settings.js";
import { KeyboardControl } from "./Control.js";
import { Player } from "./Entities.js";

export default class Game {
    renderer = new Renderer();
    controller = new KeyboardControl();

    onEnd = function () {};
    score = 0;
    frameId = null;

    // State
    state = {
        score: 0,
        seconds: 0,
        entities: [],
    };

    // Frame timers
    time = {
        dt: 0,
        last: 0,
        start: 0,
    };

    // Entities
    player = new Player();
    asteroids = [];

    /**
     * Initialize dependencies
     */
    async init() {
        this.renderer.init();
        this.player.init();
        this.controller.init();

        this.state.score = 0;
        this.time.start = Date.now();
    }

    /**
     * Main game loop
     */
    run(time = 0) {
        this.time.dt = time - this.time.last;

        // Gets game loop
        this.frameId = requestAnimationFrame(this.run.bind(this));

        this.state.entities = [this.player];
        this.state.seconds = ((Date.now() - this.time.start) / 1000).toFixed(0);

        // Update and draw
        if (this.time.dt > Settings.frmRate) {
            this.player.update(this.time.dt, this.controller.command);
            this.asteroids.forEach((e) => e.update(this.time.dt));
            this.renderer.render(this.state);
            this.time.last = time;
        }

        if (this.state.seconds > 5) this.end();
    }

    /**
     * Stops game
     */
    end() {
        cancelAnimationFrame(this.frameId);
        this.controller.end();
        this.onEnd();
    }
}
