import GameError, { errCodes } from "./Errors.js";

class GameValidator {
    /**
     * Apply all the validations
     */
    assertValid() {
        this.isDesktop();
    }

    /**
     * Checks if user is on desktop
     *
     * @param {boolean} raise
     * @returns {boolean}
     */
    isDesktop(raise = true) {
        if (typeof window.orientation !== "undefined") {
            if (raise) throw new GameError(errCodes.platformError);
            else return false;
        }
        return true;
    }
}

export default new GameValidator();
