import SETTINGS from "./core/settings.js";
import Renderer from "./core/Renderer.js";
import { KeyboardControl } from "./core/Control.js";
import Asteroid from "./entities/Asteroid.js";
import Player from "./entities/Player.js";
import { getDistance, randomInt } from "./utils/math.js";

const { INITIAL_LIFE_COUNT, FRM_DELAY, VIRTUAL, INITIAL_ASTEROID_AMOUNT } =
  SETTINGS;

export default class Game {
  /**
   * Initialize dependencies
   * @param {Number} platform
   * @param {HTMLSpanElement} htmlErrorElement
   * @param {HTMLElement} htmlGameOverElement
   * @param {HTMLElement} htmlHomeElement
   */
  constructor(platform, htmlErrorElement, htmlGameOverElement) {
    this.platform = platform;
    this.htmlErrorElement = htmlErrorElement;
    this.htmlGameOverElement = htmlGameOverElement;
    this.frameId = null;

    this.player = new Player();
    this.renderer = new Renderer();
    this.controller = new KeyboardControl();

    this.renderer.init();
    this.controller.init();

    this.asteroids = Asteroid.generateAsteroids(10, this.player);

    this.score = 0;
    this.life_count = INITIAL_LIFE_COUNT;
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
    try {
      this.time.dt = time - this.time.last;

      // Gets game loop
      this.frameId = requestAnimationFrame(this.run.bind(this));

      // Update and draw
      if (this.time.dt > FRM_DELAY) {
        // Updates data
        this.time.last = time;
        this.player.update(this.time.dt, this.controller.commands);
        this.asteroids.forEach((ast) => ast.update(this.time.dt));

        // Renders everything
        this.renderer.render({
          life_count: this.life_count,
          score: this.score,
          seconds: ((Date.now() - this.time.start) / 1000).toFixed(0),
          entities: [this.player, ...this.asteroids],
        });

        // Handles collision and stuff
        this.logic();
      }
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Centers the game's main operation logic
   */
  logic() {
    const asteroids = this.asteroids;
    const player = this.player;
    const shots = this.player.shots;

    // Handles 0 asteroid case
    if (asteroids.length === 0) {
      setTimeout(() => {
        this.player.reset();
        this.asteroids = Asteroid.generateAsteroids(
          INITIAL_ASTEROID_AMOUNT,
          this.player
        );
      });
    }

    // Shots collision
    asteroids.forEach((ast, astIndex) => {
      if (!ast.alive) return;

      // Player collision
      const playerDistance = getDistance(ast, player);
      const maxPlayerDistance = (player.radius + ast.radius) * 0.8;

      // Player collision
      if (playerDistance < maxPlayerDistance) {
        player.collisionCounter = 0;

        // Kills player
        if (player.alive) {
          this.life_count--;

          player.die().then(() => {
            if (this.life_count > 0) player.respawn();
            else this.gameOver();
          });
        }
      }

      // Shots collision
      shots.forEach((shot, shotIndex) => {
        const shotDistance = getDistance(ast, shot);

        // Shot hit asteroid
        if (shotDistance < ast.radius * 0.9) {
          // Updates score
          this.score += ast.size * 50 + 100;

          setTimeout(() => {
            // Decreases asteroid size
            if (ast.size !== 0) {
              asteroids.push(
                new Asteroid(ast.size - 1, ast.x, ast.y),
                new Asteroid(ast.size - 1, ast.x, ast.y)
              );
              asteroids.toRemove = true;
            }

            // Destroys
            asteroids.splice(astIndex, 1);
          }, 0);

          // Removes shot
          shots.splice(shotIndex, 1);
        }
      });
    });
    console.log(asteroids.length);

    // Handles shots out-of-screen
    player.shots = shots.filter(
      (shot) =>
        shot.x < VIRTUAL.w && shot.x > 0 && shot.y < VIRTUAL.h && shot.y > 0
    );
  }

  /**
   * Resets game
   */
  reset() {
    this.renderer.init();
    this.controller.init();

    this.player.reset();
    this.asteroids = Asteroid.generateAsteroids(INITIAL_ASTEROID_AMOUNT);

    this.score = 0;
    this.life_count = INITIAL_LIFE_COUNT;
    this.time = {
      dt: 0,
      last: 0,
      start: Date.now(),
    };
    this.frameId = 0;

    this.run();
  }

  /**
   * Handles zero life count
   */
  gameOver() {
    this.htmlGameOverElement.style.display = "flex";
    this.end();
  }

  /**
   * Stops game
   */
  end() {
    cancelAnimationFrame(this.frameId);
    this.renderer?.end();
    this.controller?.end();
  }
}
