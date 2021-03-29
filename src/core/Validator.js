class GameValidator {
    assertValid() {
        this.isDesktop();
    }

    // Checks if user is on desktop
    isDesktop() {
        if (typeof window.orientation == "undefined") {
            throw new Error();
        }
    }
}

export default new GameValidator();
