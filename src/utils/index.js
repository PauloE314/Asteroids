import { SETTINGS } from "../core/Game.js";

export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getPlatform() {
  return window.orientation === undefined
    ? SETTINGS.platform.desktop
    : SETTINGS.platform.mobile;
}
