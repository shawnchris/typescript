// Count Number of Trapezoids I

// You are given a 2D integer array points, where points[i] = [xi, yi] represents the coordinates of the ith point on the Cartesian plane.
// A horizontal trapezoid is a convex quadrilateral with at least one pair of horizontal sides (i.e. parallel to the x-axis). Two lines are parallel if and only if they have the same slope.
// Return the number of unique horizontal trapezoids that can be formed by choosing any four distinct points from points.
// Since the answer may be very large, return it modulo 109 + 7.

// Example 1:
// Input: points = [[1,0],[2,0],[3,0],[2,2],[3,2]]
// Output: 3
// Explanation:
// There are three distinct ways to pick four points that form a horizontal trapezoid:
//     Using points [1,0], [2,0], [3,2], and [2,2].
//     Using points [2,0], [3,0], [3,2], and [2,2].
//     Using points [1,0], [3,0], [3,2], and [2,2].

// Example 2:
// Input: points = [[0,0],[1,0],[0,1],[2,1]]
// Output: 1
// Explanation:
// There is only one horizontal trapezoid that can be formed.

// Constraints:
//     4 <= points.length <= 10^5
//     –10^8 <= xi, yi <= 10^8
//     All points are pairwise distinct.

/**
 * Counts the number of unique horizontal trapezoids that can be formed from a set of points.
 * A horizontal trapezoid is a convex quadrilateral with at least one pair of horizontal sides.
 * This implies it must have two horizontal sides.
 *
 * @param {number[][]} points An array of points, where points[i] = [xi, yi].
 * @returns {number} The number of unique horizontal trapezoids, modulo 10^9 + 7.
 */
function countTrapezoids(points: number[][]): number {
    // The modulo constant
    const MOD = 1_000_000_007;
    const MOD_BIGINT = BigInt(MOD);

    // 1. Group points by their y-coordinate and count them.
    const yCounts = new Map<number, number>();
    for (const point of points) {
        const y = point[1];
        yCounts.set(y, (yCounts.get(y) || 0) + 1);
    }

    // 2. We use the formula: Total = (1/2) * [ (Sum(C_i))^2 - Sum(C_i^2) ],
    // where C_i is the number of pairs of points on the i-th horizontal line.
    // Let s1 = Sum(C_i) and s2 = Sum(C_i^2).
    let s1 = 0n; // This will store Sum(C_i) mod M
    let s2 = 0n; // This will store Sum(C_i^2) mod M

    for (const count of yCounts.values()) {
        // We need at least 2 points on a line to form a side.
        if (count < 2) {
            continue;
        }

        const n = BigInt(count);
        // C_i = nC2 = n * (n - 1) / 2
        const c = n * (n - 1n) / 2n;
        
        // Take modulo to keep numbers within a manageable range.
        const c_mod = c % MOD_BIGINT;

        // Update s1 = (s1 + C_i) mod M
        s1 = (s1 + c_mod) % MOD_BIGINT;

        // Update s2 = (s2 + C_i^2) mod M
        const c_sq_mod = (c_mod * c_mod) % MOD_BIGINT;
        s2 = (s2 + c_sq_mod) % MOD_BIGINT;
    }

    // 3. Calculate the final result using modular arithmetic.
    
    // Calculate (s1^2) mod M
    const s1_sq = (s1 * s1) % MOD_BIGINT;

    // Calculate (s1^2 - s2) mod M. Add MOD_BIGINT to ensure the result is non-negative.
    const numerator = (s1_sq - s2 + MOD_BIGINT) % MOD_BIGINT;

    // Division by 2 in modular arithmetic is multiplication by the modular inverse of 2.
    // The modular inverse of 2 for M = 10^9 + 7 is (M+1)/2 = 500000004.
    const inv2 = 500000004n;
    
    const result = (numerator * inv2) % MOD_BIGINT;

    return Number(result);
}