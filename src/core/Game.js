import Renderer from "../Renderer.js";
import { KeyboardControl } from "./Control.js";
import { Asteroid, Player } from "./Entities.js";

export default class Game {
    renderer = new Renderer();
    controller = new KeyboardControl();
    onEnd = function () {};

    /**
     * Initialize dependencies
     * @param {Number} platform
     */
    init(platform) {
        this.frameId = null;

        this.renderer.init();
        this.controller.init();

        var i = 0;

        this.player = new Player();
        this.player.init(playerDie);

        this.asteroids = [];
        for (let i = 0; i < 10; i++) {
            this.asteroids.push(new Asteroid());
            this.asteroids[i].init();
        }

        this.score = 0;
        this.time = {
            dt: 0,
            last: 0,
            start: Date.now(),
        };
    }

    /**
     * Main game loop
     */
    run(time = 0) {
        this.time.dt = time - this.time.last;

        // Gets game loop
        this.frameId = requestAnimationFrame(this.run.bind(this));

        // Update and draw
        if (this.time.dt > SETTINGS.frmRate) {
            this.player.update(this.time.dt, this.controller.commands);
            this.asteroids.forEach((a) => a.update(this.time.dt));

            this.renderer.render({
                score: this.score,
                seconds: ((Date.now() - this.time.start) / 1000).toFixed(0),
                player: this.player,
                asteroids: this.asteroids,
            });
            this.time.last = time;
        }
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

/**
 * Handles player's death
 * @param {Player} p
 */
function playerDie(p) {}

/**
 * App settings
 */
export const SETTINGS = {
    frmRate: 30,
    maxSpeed: 30,
    platform: { desktop: 1, mobile: 2 },
    virtual: {
        p: 1.618,
        h: 700,
        w: 700 * 1.618,
    },
};
