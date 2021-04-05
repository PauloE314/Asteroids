import { radian } from "../math/index.js";
import { COMMAND_ENUM } from "./Control.js";

/**
 * Base entity class
 */
export class Entity {
    x = 0;
    y = 0;
    h = 0;
    w = 0;
    ang = 0;
    spt = null;

    /**
     * Initializes the entity
     */
    init() {}

    /**
     * Updates entity's current state
     * @param {number} dt
     */
    update(dt) {}

    /**
     * Draws entity
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {}
}

/**
 * Player base class
 */
export class Player extends Entity {
    mov = false;

    init() {
        this.x = 500;
        this.y = 300;
        this.mov = true;
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        // Initialization
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(radian(this.ang));

        // Draw path
        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.moveTo(0, -30);
        ctx.lineTo(-15, 15);
        ctx.lineTo(0, 10);
        ctx.lineTo(15, 15);
        ctx.closePath();
        ctx.stroke();

        if (this.mov) {
            ctx.beginPath();
            ctx.moveTo(-7, 12);
            ctx.lineTo(0, 25);
            ctx.lineTo(7, 12);
            ctx.stroke();
        }

        // Restore
        ctx.restore();
    }

    /**
     * @param {Number} dt
     * @param {[Number, Number, Number, Number]} commands
     */
    update(dt, commands) {
        if (commands[COMMAND_ENUM.LEFT]) this.ang -= 0.2 * dt;
        if (commands[COMMAND_ENUM.RIGHT]) this.ang += 0.2 * dt;

        // TODO
        if (commands[COMMAND_ENUM.FORWARDS]) this.mov = true;
        else this.mov = false;
        // if (commands[COMMAND_ENUM.FIRE]) this.ang -= 0.2 * dt;
    }
}

/**
 * Asteroid base class
 */
export class Asteroid extends Entity {}
