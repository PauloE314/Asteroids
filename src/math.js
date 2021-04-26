/**
 * @param {Number} a
 * @param {Number} b
 * @returns {Number}
 */
export function min(a, b) {
    return a < b ? a : b;
}

/**
 * @param {Number} n
 */
export function radian(n) {
    return (Math.PI / 180) * n;
}

/**
 * @param {Number} n
 */
export function sin(n) {
    return Math.sin(n);
}

/**
 * @param {Number} n
 */
export function cos(n) {
    return Math.cos(n);
}

/**
 * @param {Number} n
 */
export function abs(n) {
    return Math.abs(n);
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
