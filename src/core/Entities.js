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
export class Player extends Entity {}

/**
 * Asteroid base class
 */
export class Asteroid extends Entity {}
