// Longest Palindromic Path in Graph

// You are given an integer n and an undirected graph with n nodes labeled from 0 to n - 1 and a 2D array edges, 
// where edges[i] = [ui, vi] indicates an edge between nodes ui and vi.
// You are also given a string label of length n, where label[i] is the character associated with node i.
// You may start at any node and move to any adjacent node, visiting each node at most once.
// Return the maximum possible length of a palindrome that can be formed by visiting a set of unique nodes along a valid path.
// A palindrome is a string that reads the same forward and backward.

// Example 1:
// Input: n = 3, edges = [[0,1],[1,2]], label = "aba"
// Output: 3
// Explanation:
//     The longest palindromic path is from node 0 to node 2 via node 1, following the path 0 → 1 → 2 forming string "aba".
//     This is a valid palindrome of length 3.

// Example 2:
// Input: n = 3, edges = [[0,1],[0,2]], label = "abc"
// Output: 1
// Explanation:
//     No path with more than one node forms a palindrome.
//     The best option is any single node, giving a palindrome of length 1.

// Example 3:
// Input: n = 4, edges = [[0,2],[0,3],[3,1]], label = "bbac"
// Output: 3
// Explanation:
//     The longest palindromic path is from node 0 to node 1, following the path 0 → 3 → 1, forming string "bcb".
//     This is a valid palindrome of length 3.

// Constraints:
//     1 <= n <= 14
//     n - 1 <= edges.length <= n * (n - 1) / 2
//     edges[i] == [ui, vi]
//     0 <= ui, vi <= n - 1
//     ui != vi
//     label.length == n
//     label consists of lowercase English letters.
//     There are no duplicate edges.

function maxLen(n: number, edges: number[][], label: string): number {
    const adj: number[][] = Array.from({ length: n }, () => []);
    for (const [u, v] of edges) {
        adj[u].push(v);
        adj[v].push(u);
    }
    const cache = new Map<string, number>();

    const dfs = (u: number, v: number, m: number) => {
        const uk = Math.min(u, v);
        const vk = Math.max(u, v);
        const key = `${uk}+${vk}+${m}`;
        if (cache.has(key)) {
            return cache.get(key)!;
        }
        let max = 0;
        for (const uu of adj[u]) {
            if ((m & (1 << uu)) !== 0) continue;
            for (const vv of adj[v]) {
                if ((m & (1 << vv)) !== 0) continue;
                if (u === v && uu > vv) continue;
                    if (label[uu] === label[vv]) {
                    if (uu === vv) {
                        max = Math.max(max, 1);
                    } else {
                        const mask = m | (1 << uu) | (1 << vv);
                        max = Math.max(max, 2 + dfs(uu, vv, mask));
                    }
                }
            }
        }
        cache.set(key, max);
        return max;
    };
    let res = 0;
    if (n > 0) {
        res = 1;
    }
    for (let i = 0; i < n; i++) {
        const mask = (1 << i);
        res = Math.max(res, 1 + dfs(i, i, mask));
    }
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            if (label[i] === label[j]) {
                const mask = (1 << i) | (1 << j);
                res = Math.max(res, 2 + dfs(i, j, mask));
            }
        }
    }
    return res;
}

export function run() {
    console.log(maxLen(3, [[0, 1], [1, 2]], "aba")); // Output: 3
    console.log(maxLen(3, [[0, 1], [0, 2]], "abc")); // Output: 1
    console.log(maxLen(4, [[0, 2], [0, 3], [3, 1]], "bbac")); // Output: 3
}