/**
 * Calculates the greatest common divisor (GCD) of two numbers using the Euclidean algorithm.
 * @param a - The first number.
 * @param b - The second number.
 * @returns The GCD of a and b.
 */
export function gcd(a: number, b: number): number {
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}
