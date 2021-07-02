import SETTINGS from "../core/settings.js";

const { PLATFORMS } = SETTINGS;

export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getPlatform() {
  return window.orientation === undefined
    ? PLATFORMS.desktop
    : PLATFORMS.mobile;
}
