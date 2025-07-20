// Number of Integers With Popcount-Depth Equal to K II

// You are given an integer array nums.
// For any positive integer x, define the following sequence:
//     p0 = x
//     pi+1 = popcount(pi) for all i >= 0, where popcount(y) is the number of set bits (1's) in the binary representation of y.
// This sequence will eventually reach the value 1.
// The popcount-depth of x is defined as the smallest integer d >= 0 such that pd = 1.
// For example, if x = 7 (binary representation "111"). Then, the sequence is: 7 → 3 → 2 → 1, so the popcount-depth of 7 is 3.
// You are also given a 2D integer array queries, where each queries[i] is either:
//     [1, l, r, k] - Determine the number of indices j such that l <= j <= r and the popcount-depth of nums[j] is equal to k.
//     [2, idx, val] - Update nums[idx] to val.
// Return an integer array answer, where answer[i] is the number of indices for the ith query of type [1, l, r, k].

// Example 1:
// Input: nums = [2,4], queries = [[1,0,1,1],[2,1,1],[1,0,1,0]]
// Output: [2,1]
// Explanation:
// i	queries[i]	nums	binary(nums)	popcount-
// depth	[l, r]	k	Valid
// nums[j]	updated
// nums	Answer
// 0	[1,0,1,1]	[2,4]	[10, 100]	[1, 1]	[0, 1]	1	[0, 1]	—	2
// 1	[2,1,1]	[2,4]	[10, 100]	[1, 1]	—	—	—	[2,1]	—
// 2	[1,0,1,0]	[2,1]	[10, 1]	[1, 0]	[0, 1]	0	[1]	—	1
// Thus, the final answer is [2, 1].

// Example 2:
// Input: nums = [3,5,6], queries = [[1,0,2,2],[2,1,4],[1,1,2,1],[1,0,1,0]]
// Output: [3,1,0]
// Explanation:
// i	queries[i]	nums	binary(nums)	popcount-
// depth	[l, r]	k	Valid
// nums[j]	updated
// nums	Answer
// 0	[1,0,2,2]	[3, 5, 6]	[11, 101, 110]	[2, 2, 2]	[0, 2]	2	[0, 1, 2]	—	3
// 1	[2,1,4]	[3, 5, 6]	[11, 101, 110]	[2, 2, 2]	—	—	—	[3, 4, 6]	—
// 2	[1,1,2,1]	[3, 4, 6]	[11, 100, 110]	[2, 1, 2]	[1, 2]	1	[1]	—	1
// 3	[1,0,1,0]	[3, 4, 6]	[11, 100, 110]	[2, 1, 2]	[0, 1]	0	[]	—	0
// Thus, the final answer is [3, 1, 0].

// Example 3:
// Input: nums = [1,2], queries = [[1,0,1,1],[2,0,3],[1,0,0,1],[1,0,0,2]]
// Output: [1,0,1]
// Explanation:
// i	queries[i]	nums	binary(nums)	popcount-
// depth	[l, r]	k	Valid
// nums[j]	updated
// nums	Answer
// 0	[1,0,1,1]	[1, 2]	[1, 10]	[0, 1]	[0, 1]	1	[1]	—	1
// 1	[2,0,3]	[1, 2]	[1, 10]	[0, 1]	—	—	—	[3, 2]	 
// 2	[1,0,0,1]	[3, 2]	[11, 10]	[2, 1]	[0, 0]	1	[]	—	0
// 3	[1,0,0,2]	[3, 2]	[11, 10]	[2, 1]	[0, 0]	2	[0]	—	1
// Thus, the final answer is [1, 0, 1].

// Constraints:
//     1 <= n == nums.length <= 10^5
//     1 <= nums[i] <= 10^15
//     1 <= queries.length <= 10^5
//     queries[i].length == 3 or 4
//         queries[i] == [1, l, r, k] or,
//         queries[i] == [2, idx, val]
//         0 <= l <= r <= n - 1
//         0 <= k <= 5
//         0 <= idx <= n - 1
//         1 <= val <= 10^15

/**
 * A Fenwick Tree (or Binary Indexed Tree) data structure.
 * It supports efficient point updates and prefix sum queries.
 */
class FenwickTree {
    private size: number;
    private tree: number[];

    constructor(n: number) {
        this.size = n;
        this.tree = new Array(n + 1).fill(0);
    }

    /** Adds a delta to the value at a 1-based index `i`. */
    add(i: number, delta: number): void {
        while (i <= this.size) {
            this.tree[i] += delta;
            i += i & -i; // Move to the next index that `i` contributes to.
        }
    }

    /** Queries the cumulative sum from index 1 up to a 1-based index `i`. */
    private query(i: number): number {
        let sum = 0;
        while (i > 0) {
            sum += this.tree[i];
            i -= i & -i; // Move to the parent index in the implicit tree.
        }
        return sum;
    }
    
    /** Queries the sum for a 1-based range [l, r]. */
    queryRange(l: number, r: number): number {
        if (l > r) {
            return 0;
        }
        return this.query(r) - this.query(l - 1);
    }
}

/**
 * Counts the number of set bits (1s) in a number's binary representation.
 * This implementation correctly handles numbers larger than 2^32.
 */
function popcount(num: number): number {
    // A number's binary representation can be found with toString(2).
    const binStr = num.toString(2);
    let count = 0;
    for (let i = 0; i < binStr.length; i++) {
        if (binStr[i] === '1') {
            count++;
        }
    }
    return count;
}


function popcountDepth(nums: number[], queries: number[][]): number[] {
    const n = nums.length;
    
    // Cache for storing computed popcount-depths to avoid redundant calculations.
    const depthCache = new Map<number, number>();

    /**
     * Recursively calculates the popcount-depth of a number using memoization.
     */
    function calculateDepth(num: number): number {
        if (num === 1) return 0;
        if (depthCache.has(num)) return depthCache.get(num)!;
        
        const depth = 1 + calculateDepth(popcount(num));
        depthCache.set(num, depth);
        return depth;
    }

    // Maximum depth `k` is 5 according to constraints.
    const MAX_DEPTH = 5;
    const bits: FenwickTree[] = [];
    for (let k = 0; k <= MAX_DEPTH; k++) {
        bits.push(new FenwickTree(n));
    }

    // Initialize the Fenwick trees based on the initial `nums` array.
    for (let i = 0; i < n; i++) {
        const depth = calculateDepth(nums[i]);
        if (depth <= MAX_DEPTH) {
            // Fenwick trees use 1-based indexing, so we use i + 1.
            bits[depth].add(i + 1, 1);
        }
    }

    const answer: number[] = [];

    // Process each query.
    for (const query of queries) {
        const type = query[0];

        if (type === 1) { // Range Query
            const [_, l, r, k] = query;
            if (k > MAX_DEPTH) {
                answer.push(0);
            } else {
                // Convert 0-based range [l, r] to 1-based for the Fenwick tree.
                const count = bits[k].queryRange(l + 1, r + 1);
                answer.push(count);
            }
        } else { // Point Update
            const [_, idx, val] = query;

            // Remove the contribution of the old value.
            const oldDepth = calculateDepth(nums[idx]);
            if (oldDepth <= MAX_DEPTH) {
                bits[oldDepth].add(idx + 1, -1);
            }
            
            // Update the array.
            nums[idx] = val;

            // Add the contribution of the new value.
            const newDepth = calculateDepth(val);
            if (newDepth <= MAX_DEPTH) {
                bits[newDepth].add(idx + 1, 1);
            }
        }
    }

    return answer;
}

export function run() {
    console.log(popcountDepth([2, 4], [[1, 0, 1, 1], [2, 1, 1], [1, 0, 1, 0]])); // Output: [2, 1]
    console.log(popcountDepth([3, 5, 6], [[1, 0, 2, 2], [2, 1, 4], [1, 1, 2, 1], [1, 0, 1, 0]])); // Output: [3, 1, 0]
    console.log(popcountDepth([1, 2], [[1, 0, 1, 1], [2, 0, 3], [1, 0, 0, 1], [1, 0, 0, 2]])); // Output: [1, 0, 1]
}