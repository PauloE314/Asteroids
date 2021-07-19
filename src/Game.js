import SETTINGS from "./core/settings.js";
import Renderer from "./core/Renderer.js";
import { KeyboardControl } from "./core/Control.js";
import Asteroid from "./entities/Asteroid.js";
import Player from "./entities/Player.js";
import { getDistance } from "./utils/math.js";

const { INITIAL_LIFE_COUNT, FRM_DELAY, VIRTUAL, INITIAL_ASTEROID_AMOUNT } =
  SETTINGS;

export default class Game {
  onGameOver() {}

  /**
   * Initialize the game
   */
  constructor() {
    this.frameId = null;

    this.player = new Player();
    this.renderer = new Renderer();
    this.controller = new KeyboardControl();

    this.renderer.init();
    this.controller.init();

    this.asteroids = Asteroid.generateAsteroids(
      INITIAL_ASTEROID_AMOUNT,
      this.player
    );

    this.score = 0;
    this.lifeCount = INITIAL_LIFE_COUNT;
    this.time = {
      dt: 0,
      last: 0,
      start: Date.now(),
    };

    // Loads max score
    this.maxScore = 0;
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
          lifeCount: this.lifeCount,
          score: this.score,
          maxScore: this.maxScore,
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
    const player = this.player;
    const shots = this.player.shots;

    // Handles 0 asteroid case
    if (this.asteroids.length === 0) {
      const playerAngle = this.player.ang;

      this.player.reset();
      this.player.ang = playerAngle;

      this.asteroids = Asteroid.generateAsteroids(
        INITIAL_ASTEROID_AMOUNT,
        this.player
      );
    }

    // Shots collision
    this.asteroids.forEach((ast) => {
      // Player collision
      const playerDistance = getDistance(ast, player);
      const maxPlayerDistance = (player.radius + ast.radius) * 0.8;

      // Player collision
      if (playerDistance < maxPlayerDistance) {
        player.collisionCounter = 0;

        // Kills player
        if (player.alive) {
          this.lifeCount--;

          player.die().then(() => {
            if (this.lifeCount > 0) player.respawn();
            else this.gameOver();
          });
        }
      }

      // Shots collision
      shots.forEach((shot) => {
        const shotDistance = getDistance(ast, shot);

        // Shot hit asteroid
        if (shotDistance < ast.radius * 0.9) {
          // Updates score
          this.score += ast.size * 50 + 100;

          // Decreases asteroid size
          if (ast.size !== 0) {
            this.asteroids.push(
              new Asteroid(ast.size - 1, ast.x, ast.y),
              new Asteroid(ast.size - 1, ast.x, ast.y)
            );
          }

          ast.alive = false;
          shot.alive = false;
        }
      });
    });

    // Removes asteroids
    this.asteroids = this.asteroids.filter((ast) => ast.alive);

    // Removes shots
    player.shots = shots.filter((shot) => {
      return (
        shot.alive &&
        shot.x < VIRTUAL.w &&
        shot.x > 0 &&
        shot.y < VIRTUAL.h &&
        shot.y > 0
      );
    });
  }

  /**
   * Resets game
   */
  reset() {
    this.renderer.end();
    this.controller.end();

    this.renderer.init();
    this.controller.init();

    this.player.reset();
    this.asteroids = Asteroid.generateAsteroids(
      INITIAL_ASTEROID_AMOUNT,
      this.player
    );

    this.score = 0;
    this.lifeCount = INITIAL_LIFE_COUNT;
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
    const recordBreak = this.maxScore < this.score;

    if (recordBreak) this.maxScore = this.score;
    this.onGameOver(recordBreak);
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
