// Count Distinct Integers After Removing Zeros
// You are given a positive integer n.
// For every integer x from 1 to n, we write down the integer obtained by removing all zeros from the decimal representation of x.
// Return an integer denoting the number of distinct integers written down.

// Example 1:
// Input: n = 10
// Output: 9
// Explanation:
// The integers we wrote down are 1, 2, 3, 4, 5, 6, 7, 8, 9, 1. There are 9 distinct integers (1, 2, 3, 4, 5, 6, 7, 8, 9).

// Example 2:
// Input: n = 3
// Output: 3
// Explanation:
// The integers we wrote down are 1, 2, 3. There are 3 distinct integers (1, 2, 3).

// Constraints:
// 1 <= n <= 10^15

function countDistinct(n: number): number {
    // Count numbers in [1..n] that contain no zero digit.
    // Any number produced by removing zeros from some x <= n must be <= n
    // and contain no zero digits. So the answer equals the count of
    // positive integers <= n with no digit equal to 0. Use digit DP to
    // handle n up to 1e15 efficiently.
    const s = n.toString();
    const len = s.length;
    const memo = new Map<string, number>();

    function dfs(pos: number, tight: boolean, started: boolean): number {
        if (pos === len) return started ? 1 : 0;
        const key = `${pos},${tight ? 1 : 0},${started ? 1 : 0}`;
        if (memo.has(key)) return memo.get(key)!;
        const limit = tight ? Number(s[pos]) : 9;
        let ans = 0;
        for (let d = 0; d <= limit; d++) {
            const ntight = tight && (d === limit);
            if (d === 0) {
                // We may skip leading zeros (not started yet). But once started,
                // zeros are forbidden because the resulting number must be zero-free.
                if (!started) {
                    ans += dfs(pos + 1, ntight, false);
                }
            } else {
                // place a non-zero digit (1-9)
                ans += dfs(pos + 1, ntight, true);
            }
        }
        memo.set(key, ans);
        return ans;
    }

    return dfs(0, true, false);
}