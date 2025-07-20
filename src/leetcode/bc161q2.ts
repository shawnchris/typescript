// Count Islands With Total Value Divisible by K

// You are given an m x n matrix grid and a positive integer k. An island is a group of positive integers (representing land) that are 4-directionally connected (horizontally or vertically).
// The total value of an island is the sum of the values of all cells in the island.
// Return the number of islands with a total value divisible by k.

// Example 1:
// Input: grid = [[0,2,1,0,0],[0,5,0,0,5],[0,0,1,0,0],[0,1,4,7,0],[0,2,0,0,8]], k = 5
// Output: 2
// Explanation:
// The grid contains four islands. The islands highlighted in blue have a total value that is divisible by 5, while the islands highlighted in red do not.

// Example 2:
// Input: grid = [[3,0,3,0], [0,3,0,3], [3,0,3,0]], k = 3
// Output: 6
// Explanation:
// The grid contains six islands, each with a total value that is divisible by 3.
 
// Constraints:
//     m == grid.length
//     n == grid[i].length
//     1 <= m, n <= 1000
//     1 <= m * n <= 10^5
//     0 <= grid[i][j] <= 10^6
//     1 <= k <= 10^6

function countIslands(grid: number[][], k: number): number {
    const m = grid.length;
    const n = grid[0].length;
    const visited = Array.from({ length: m }, () => Array(n).fill(false));
    let res = 0;

    const dfs = (i: number, j: number): number => {
        if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] === 0 || visited[i][j]) {
            return 0;
        }
        visited[i][j] = true;
        let sum = grid[i][j];
        sum += dfs(i - 1, j);
        sum += dfs(i + 1, j);
        sum += dfs(i, j - 1);
        sum += dfs(i, j + 1);
        return sum;
    };

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (grid[i][j] > 0 && !visited[i][j]) {
                const total = dfs(i, j);
                if (total % k === 0) {
                    res++;
                }
            }
        }
    }
    return res;
};