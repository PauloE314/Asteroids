export const CONTROL_CODES = {
    left: 1,
    right: 2,
    forwards: 3,
};

const KB_CODES = {
    KeyA: CONTROL_CODES.left,
    KeyD: CONTROL_CODES.right,
    Space: CONTROL_CODES.forwards,
};

export class Control {
    lastCommand = 0;
    command = 0;

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
        this.command = KB_CODES[event.code];
    }

    /**
     * @param {KeyboardEvent} event
     */
    onKeyup(event) {
        this.command = 0;
    }

    /**
     * Removes listeners
     */
    end() {
        document.removeEventListener("keydown", this.onKeydown);
        document.removeEventListener("keyup", this.onKeyup);
    }
}

export class KeyboardControl extends Control {}
