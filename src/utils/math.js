// CONSTANTS
export const _2PI = Math.PI * 2;

/**
 * @param {Number} n Angle in degrees
 */
export function radian(n) {
  return (Math.PI / 180) * n;
}

/**
 * @param {Number} n Min value
 * @param {Number} m Max value
 */
export function random(n, m) {
  return Math.random() * (m - n) + n;
}

/**
 * @param {Number} n Min value
 * @param {Number} m Max value
 */
export function randomInt(n, m) {
  return Math.round(Math.random() * (m - n) + n);
}

/**
 * @param {{x: Number, y: Number}} a
 * @param {{x: Number, y: Number}} b
 */
export function getDistance(a, b) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}
