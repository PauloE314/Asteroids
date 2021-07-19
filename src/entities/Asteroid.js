import Entity from "./Entities.js";
import { getDistance, random, randomInt, _2PI } from "../utils/math.js";
import Particle from "./Particle.js";
import SETTINGS from "../core/settings.js";

const { VIRTUAL } = SETTINGS;

/**
 * Asteroid base class
 */
export default class Asteroid extends Entity {
  vr = 0;
  dots = [];

  /**
   * Creates an asteroid with specific size. Its size can vary from 0 (small) to 2 (big)
   * @param {Number} size
   * @param {NUmber} x
   * @param {NUmber} y
   */
  constructor(size, x, y) {
    super();

    this.size = size;
    this.radius = 25 * Math.pow(2, this.size);

    this.x = x;
    this.y = y;
    this.vx = random(-10, 10);
    this.vy = random(-10, 10);
    this.vr = random(10, 60);
    this.visible = true;

    /**
     * @type Number[]
     */
    this.dots = ASTEROID_DOT_PATHS["smb".charAt(this.size)][randomInt(0, 2)];

    /**
     * @type Particle[]
     */
    this.particles = [];
  }

  /**
   * Renders asteroid nd possible particles
   * @param {CanvasRenderingContext2D} ctx
   */
  render(ctx) {
    super.render(ctx);
    this.particles.forEach((p) => p.render(ctx));
  }

  /**
   * Draws asteroid
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    // Draw path
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.moveTo(this.dots[0][0], this.dots[0][1]);
    for (let i = 1; i < 7; i++) ctx.lineTo(this.dots[i][0], this.dots[i][1]);
    ctx.closePath();
    ctx.stroke();
  }

  /**
   * Updates asteroid state
   * @param {Number} dt
   */
  update(dt) {
    this.setAngle(this.ang + dt * this.vr * 0.00005);
    this.particles.forEach((p) => p.update(dt));
    this.move(dt);
  }

  /**
   * Generates various asteroids in random positions and velocities. It prevents asteroids in "playerPosition" position
   * @param {Number} n
   * @param {{x: number, y: number}} playerPosition
   * @returns Asteroids[]
   */
  static generateAsteroids(n, playerPosition) {
    const asteroids = [];

    for (let i = 0; i < n; i++) {
      const size = randomInt(0, 2);
      const pos = {
        x: 0,
        y: 0,
      };

      // Exclude generation in playerPosition in a 100 units range
      do {
        pos.x = random(0, VIRTUAL.w);
        pos.y = random(0, VIRTUAL.h);
      } while (getDistance(pos, playerPosition) < 250);

      asteroids.push(new Asteroid(size, pos.x, pos.y));
    }

    return asteroids;
  }
}

/**
 * Asteroids paths (always have 6 dots)
 */
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
