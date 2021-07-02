import Entity, { EntityState } from "./Entities.js";
import SETTINGS from "../core/settings.js";
import { random, randomInt, _2PI } from "../utils/math.js";

const { VIRTUAL, ENTITY_TYPES } = SETTINGS;

/**
 * Asteroid base class
 */
export default class Asteroid extends Entity {
  type = ENTITY_TYPES.ASTEROID;
  vr = 0;
  dots = [];

  init() {
    super.init();

    this.size = randomInt(0, 2); // 2 - big, 1 - medium, - 0 small
    this.radius = 25 * Math.pow(2, this.size);

    this.x = random(0, VIRTUAL.w);
    this.y = random(0, VIRTUAL.h);
    this.vx = random(-10, 10);
    this.vy = random(-10, 10);
    this.vr = random(10, 60);

    this.dots = ASTEROID_DOT_PATHS["smb".charAt(this.size)][randomInt(0, 2)];

    this.setState(ALIVE_STATE);
  }
}

/**
 * Possible asteroid states
 */
const ALIVE_STATE = new EntityState({
  /**
   * @param {Asteroid} asteroid
   * @param {Number} dt
   */
  update(asteroid, dt) {
    asteroid.setAngle(asteroid.ang + dt * asteroid.vr * 0.00005);
    asteroid.move(dt);
  },

  /**
   * @param {Asteroid} asteroid
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(asteroid, ctx) {
    // Draw path
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.moveTo(asteroid.dots[0][0], asteroid.dots[0][1]);
    for (let i = 1; i < 7; i++)
      ctx.lineTo(asteroid.dots[i][0], asteroid.dots[i][1]);
    ctx.closePath();
    ctx.stroke();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.beginPath();
    ctx.arc(0, 0, asteroid.radius, 0, _2PI);
    ctx.stroke();
  },
});

// Asteroids paths (always have 6 dots)
const ASTEROID_DOT_PATHS = {
  s: [
    // 25 radius
    [
      [0, -20],
      [20, -12],
      [18, 0],
      [10, 26],
      [-15, 8],
      [-24, 7],
      [-20, -20],
    ],
    [
      [12, -24],
      [22, -10],
      [18, 20],
      [10, 26],
      [-15, 8],
      [-0, 7],
      [-18, -18],
    ],
    [
      [20, -15],
      [25, 10],
      [10, 12],
      [10, 26],
      [-9, 8],
      [-24, 7],
      [-20, -20],
    ],
  ],
  m: [
    // 50 radius
    [
      [0, -50],
      [12, -15],
      [50, 0],
      [10, 45],
      [-35, 35],
      [-48, 5],
      [-40, -20],
    ],
    [
      [-30, -50],
      [22, -42],
      [35, 15],
      [0, 50],
      [-20, 15],
      [-50, 5],
      [-40, -20],
    ],
    [
      [-28, -30],
      [32, -30],
      [12, 0],
      [32, 40],
      [-33, 35],
      [-38, 20],
      [-48, -0],
    ],
  ],
  b: [
    // 100 radius
    [
      [-80, -60],
      [30, -90],
      [90, -40],
      [50, 80],
      [-64, 75],
      [-38, 50],
      [-70, -0],
    ],
    [
      [-40, -44],
      [0, -95],
      [88, -44],
      [70, 65],
      [-40, 70],
      [-50, 20],
      [-90, -30],
    ],
    [
      [-42, -83],
      [68, -60],
      [38, 8],
      [60, 75],
      [-50, 53],
      [-68, 68],
      [-98, -0],
    ],
  ],
};