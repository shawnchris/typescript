// Minimum Cost Path with Alternating Directions II

// You are given two integers m and n representing the number of rows and columns of a grid, respectively.
// The cost to enter cell (i, j) is defined as (i + 1) * (j + 1).
// You are also given a 2D integer array waitCost where waitCost[i][j] defines the cost to wait on that cell.
// You start at cell (0, 0) at second 1.
// At each step, you follow an alternating pattern:
//     On odd-numbered seconds, you must move right or down to an adjacent cell, paying its entry cost.
//     On even-numbered seconds, you must wait in place, paying waitCost[i][j].
// Return the minimum total cost required to reach (m - 1, n - 1).


// Example 1:
// Input: m = 1, n = 2, waitCost = [[1,2]]
// Output: 3
// Explanation:
// The optimal path is:
//     Start at cell (0, 0) at second 1 with entry cost (0 + 1) * (0 + 1) = 1.
//     Second 1: Move right to cell (0, 1) with entry cost (0 + 1) * (1 + 1) = 2.
// Thus, the total cost is 1 + 2 = 3.

// Example 2:
// Input: m = 2, n = 2, waitCost = [[3,5],[2,4]]
// Output: 9
// Explanation:
// The optimal path is:
//     Start at cell (0, 0) at second 1 with entry cost (0 + 1) * (0 + 1) = 1.
//     Second 1: Move down to cell (1, 0) with entry cost (1 + 1) * (0 + 1) = 2.
//     Second 2: Wait at cell (1, 0), paying waitCost[1][0] = 2.
//     Second 3: Move right to cell (1, 1) with entry cost (1 + 1) * (1 + 1) = 4.
// Thus, the total cost is 1 + 2 + 2 + 4 = 9.

// Example 3:
// Input: m = 2, n = 3, waitCost = [[6,1,4],[3,2,5]]
// Output: 16
// Explanation:
// The optimal path is:
//     Start at cell (0, 0) at second 1 with entry cost (0 + 1) * (0 + 1) = 1.
//     Second 1: Move right to cell (0, 1) with entry cost (0 + 1) * (1 + 1) = 2.
//     Second 2: Wait at cell (0, 1), paying waitCost[0][1] = 1.
//     Second 3: Move down to cell (1, 1) with entry cost (1 + 1) * (1 + 1) = 4.
//     Second 4: Wait at cell (1, 1), paying waitCost[1][1] = 2.
//     Second 5: Move right to cell (1, 2) with entry cost (1 + 1) * (2 + 1) = 6.
// Thus, the total cost is 1 + 2 + 1 + 4 + 2 + 6 = 16.

// Constraints:
//     1 <= m, n <= 105
//     2 <= m * n <= 105
//     waitCost.length == m
//     waitCost[0].length == n
//     0 <= waitCost[i][j] <= 105

function minCost(m: number, n: number, waitCost: number[][]): number {
    const dp: number[][] = Array.from({ length: m }, () => Array(n).fill(Infinity));
    dp[0][0] = 1; // Starting cost at (0, 0)

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (i > 0) {
                // Move down
                dp[i][j] = Math.min(dp[i][j], dp[i - 1][j] + (i + 1) * (j + 1));
            }
            if (j > 0) {
                // Move right
                dp[i][j] = Math.min(dp[i][j], dp[i][j - 1] + (i + 1) * (j + 1));
            }
            if (!(i === m - 1 && j === n - 1 || (i === 0 && j === 0))) {
                // Wait cost on even seconds
                dp[i][j] += waitCost[i][j];
            }
        }
    }

    return dp[m - 1][n - 1];
};

export function run() {
    console.log(minCost(1, 2, [[1, 2]])); // Output: 3
    console.log(minCost(2, 2, [[3, 5], [2, 4]])); // Output: 9
    console.log(minCost(2, 3, [[6, 1, 4], [3, 2, 5]])); // Output: 16
}