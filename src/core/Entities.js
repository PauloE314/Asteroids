import { sin, cos } from "../math/index.js";
import { COMMAND_ENUM } from "./Control.js";
import { SETTINGS } from "./Game.js";

/**
 * Base entity class
 */
export class Entity {
    x = 0;
    y = 0;
    vx = 0;
    vy = 0;
    radius = 30;
    ang = 0; // Inclination angle
    spt = null; // Sprite (TEMP)

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
     * Default entity update, common for all entities
     * @param {number} dt
     */
    defaultUpdate(dt) {
        if (this.x >= SETTINGS.virtual.w + this.radius) this.x = 0;
        else if (this.x <= -this.radius) this.x = SETTINGS.virtual.w;

        if (this.y >= SETTINGS.virtual.h + this.radius) this.y = 0;
        else if (this.y <= -this.radius) this.y = SETTINGS.virtual.h;
    }

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
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        // Initialization
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.ang);

        // Draw path
        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.moveTo(30, 0);
        ctx.lineTo(-15, -15);
        ctx.lineTo(-10, 0);
        ctx.lineTo(-15, 15);
        ctx.closePath();
        ctx.stroke();

        if (this.mov) {
            ctx.beginPath();
            ctx.moveTo(-13, -10); // left
            ctx.lineTo(-25, 0); // middle
            ctx.lineTo(-13, 10); // left
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
        if (commands[COMMAND_ENUM.LEFT]) this.ang -= 0.005 * dt;
        if (commands[COMMAND_ENUM.RIGHT]) this.ang += 0.005 * dt;

        // TODO
        if (commands[COMMAND_ENUM.FORWARDS]) this.mov = true;
        else this.mov = false;
        // if (commands[COMMAND_ENUM.FIRE]) this.ang -= 0.2 * dt;

        // Speed
        const nextVY = this.vy + sin(this.ang) * this.mov;
        const nextVX = this.vx + cos(this.ang) * this.mov;

        if (Math.abs(nextVY) <= SETTINGS.maxSpeed) this.vy = nextVY;
        if (Math.abs(nextVX) <= SETTINGS.maxSpeed) this.vx = nextVX;

        // Move
        this.y += this.vy * dt * 0.015;
        this.x += this.vx * dt * 0.015;

        // Default update
        this.defaultUpdate(dt);
    }
}

/**
 * Asteroid base class
 */
export class Asteroid extends Entity {}
