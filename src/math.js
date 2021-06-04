/**
 * @param {Number} n
 */
export function radian(n) {
  return (Math.PI / 180) * n;
}

/**
 * @param {Number} n
 * @param {Number} m
 */
export function random(n, m) {
  return Math.random() * (m - n) + n;
}

/**
 * @param {Number} n
 * @param {Number} m
 */
export function randomInt(n, m) {
  return Math.round(Math.random() * (m - n) + n);
}
