export const COMMAND_ENUM = {
  LEFT: 0,
  RIGHT: 1,
  FORWARDS: 2,
  FIRE: 3,
};

/**
 * Base control interface
 */
export class Control {
  lastCommand = 0;
  commands = [false, false, false, false]; // LEFT, RIGHT, FORWARDS, FIRE

  init() {}
  end() {}
}

export class KeyboardControl extends Control {
  KEY_CODES = {
    KeyA: COMMAND_ENUM.LEFT,
    KeyD: COMMAND_ENUM.RIGHT,
    KeyW: COMMAND_ENUM.FORWARDS,
    Space: COMMAND_ENUM.FIRE,
  };

  /**
   * Initializes listeners and initial settings
   */
  init() {
    this.onKeydown = this.onKeydown.bind(this);
    this.onKeyup = this.onKeyup.bind(this);

    document.addEventListener("keydown", this.onKeydown);
    document.addEventListener("keyup", this.onKeyup);
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeydown(event) {
    const command = this.KEY_CODES[event.code];
    if (command !== undefined) this.commands[command] = true;
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyup(event) {
    const command = this.KEY_CODES[event.code];
    if (command !== undefined) this.commands[command] = false;
  }

  /**
   * Removes listeners
   */
  end() {
    document.removeEventListener("keydown", this.onKeydown);
    document.removeEventListener("keyup", this.onKeyup);
  }
}
