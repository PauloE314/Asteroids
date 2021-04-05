import settings from "../core/Settings.js";

export function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getPlatform() {
    return window.orientation === undefined
        ? settings.platform.desktop
        : settings.platform.mobile;
}
