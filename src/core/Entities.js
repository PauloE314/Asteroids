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
    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        ctx.beginPath();
        ctx.strokeStyle = "white";
        ctx.moveTo(10, 10);
        ctx.lineTo(50, 50);
        ctx.lineTo(10, 50);
        ctx.lineTo(10, 10);
        ctx.stroke();
        ctx.closePath();
    }
}

/**
 * Asteroid base class
 */
export class Asteroid extends Entity {}
