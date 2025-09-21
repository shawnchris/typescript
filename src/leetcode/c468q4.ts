// Maximum Total Subarray Value II
// You are given an integer array nums of length n and an integer k.
// You must select exactly k distinct non-empty subarrays nums[l..r] of nums. Subarrays may overlap, but the exact same subarray (same l and r) cannot be chosen more than once.
// The value of a subarray nums[l..r] is defined as: max(nums[l..r]) - min(nums[l..r]).
// The total value is the sum of the values of all chosen subarrays.
// Return the maximum possible total value you can achieve.
// A subarray is a contiguous non-empty sequence of elements within an array.

// Example 1:
// Input: nums = [1,3,2], k = 2
// Output: 4
// Explanation:
// One optimal approach is:
// Choose nums[0..1] = [1, 3]. The maximum is 3 and the minimum is 1, giving a value of 3 - 1 = 2.
// Choose nums[0..2] = [1, 3, 2]. The maximum is still 3 and the minimum is still 1, so the value is also 3 - 1 = 2.
// Adding these gives 2 + 2 = 4.

// Example 2:
// Input: nums = [4,2,5,1], k = 3
// Output: 12
// Explanation:
// One optimal approach is:
// Choose nums[0..3] = [4, 2, 5, 1]. The maximum is 5 and the minimum is 1, giving a value of 5 - 1 = 4.
// Choose nums[1..3] = [2, 5, 1]. The maximum is 5 and the minimum is 1, so the value is also 4.
// Choose nums[2..3] = [5, 1]. The maximum is 5 and the minimum is 1, so the value is again 4.
// Adding these gives 4 + 4 + 4 = 12.

// Constraints:

// 1 <= n == nums.length <= 5 * 10​​​​​​​^4
// 0 <= nums[i] <= 10^9
// 1 <= k <= min(10^5, n * (n + 1) / 2)

import { PriorityQueue } from "@datastructures-js/priority-queue";

// This interface defines the data stored in the max-heap.
// It tracks a subarray's value, its start (l), and its end (r).
interface Node {
    val: number; // The value (max - min)
    l: number;   // The start index
    r: number;   // The end index
}

/**
 * A Segment Tree data structure.
 * It is built on the input array `nums` and can quickly find
 * the [minimum, maximum] of any subarray range [l, r] in O(log n) time.
 */
class SegmentTree {
    // The tree is an array of [min, max] tuples.
    private tree: [number, number][];
    private n: number;

    constructor(nums: number[]) {
        this.n = nums.length;
        // A segment tree typically needs up to 4*n space.
        this.tree = Array(4 * this.n).fill([Infinity, -Infinity]);
        this.build(nums, 0, 0, this.n - 1);
    }

    // Recursively builds the segment tree
    private build(nums: number[], v: number, tl: number, tr: number) {
        // v: current vertex (node) index
        // tl, tr: tree node's left and right boundaries
        
        if (tl === tr) {
            // Leaf node: stores the actual array element
            this.tree[v] = [nums[tl], nums[tl]];
            return;
        }
        
        // Find children and midpoint
        const tm = Math.floor((tl + tr) / 2);
        const vl = 2 * v + 1; // left child index
        const vr = 2 * v + 2; // right child index

        // Build children first
        this.build(nums, vl, tl, tm);
        this.build(nums, vr, tm + 1, tr);
        
        // Merge children's [min, max] results into the parent node
        this.tree[v] = [
            Math.min(this.tree[vl][0], this.tree[vr][0]), // Overall min
            Math.max(this.tree[vl][1], this.tree[vr][1]), // Overall max
        ];
    }

    /**
     * Public query method.
     * Finds the [min, max] for the given range [l, r].
     */
    query(l: number, r: number): [number, number] {
        return this.queryRecursive(0, 0, this.n - 1, l, r);
    }

    // Recursive helper for the query
    private queryRecursive(v: number, tl: number, tr: number, l: number, r: number): [number, number] {
        if (r < tl || tr < l) {
            // Case 1: The query range [l, r] is completely outside
            // the node's range [tl, tr]. Return a neutral value.
            return [Infinity, -Infinity];
        }
        if (l <= tl && tr <= r) {
            // Case 2: The node's range is completely inside the query range.
            // Return this node's stored value.
            return this.tree[v];
        }
        
        // Case 3: Partial overlap. Recurse into children.
        const tm = Math.floor((tl + tr) / 2);
        const vl = 2 * v + 1;
        const vr = 2 * v + 2;

        const resL = this.queryRecursive(vl, tl, tm, l, r);
        const resR = this.queryRecursive(vr, tm + 1, tr, l, r);

        // Merge the results from children
        return [
            Math.min(resL[0], resR[0]),
            Math.max(resL[1], resR[1]),
        ];
    }
}

/**
 * Main solution function.
 * Finds the sum of the top k subarray values using an O((n+k) log n) algorithm.
 * This treats the problem as finding the k-largest items from n sorted lists.
 */
function maxTotalValue(nums: number[], k: number): number {
    const n = nums.length;
    if (n === 0) return 0;
    
    // 1. Build the Segment Tree for fast O(log n) queries.
    const tree = new SegmentTree(nums);

    // 2. Create a Max-Heap using PriorityQueue.
    // The comparator (a, b) => b.val - a.val sorts by 'val' descending.
    const heap = new PriorityQueue<Node>(
        (a, b) => b.val - a.val
    );

    // 3. Initialize the heap.
    // For each starting index 'l', we have a "virtual list" of subarrays:
    // [l..l], [l..l+1], ..., [l..n-1]
    // The values (max-min) in this list are non-decreasing.
    // We add the *largest* element from each list to the heap.
    for (let l = 0; l < n; l++) {
        // The largest-value subarray starting at 'l' is [l..n-1].
        const [min, max] = tree.query(l, n - 1);
        const val = max - min;
        heap.enqueue({ val: val, l: l, r: n - 1 });
    }

    let sum = 0;
    
    // 4. Run the main loop 'k' times to extract the top k values.
    for (let i = 0; i < k; i++) {
        if (heap.isEmpty()) {
            // This happens if k is larger than the total number
            // of subarrays, n*(n+1)/2.
            break;
        }

        // 5. Dequeue the current best subarray in the entire set
        const { val, l, r } = heap.dequeue();
        sum += val;

        // 6. Add the "next-best" subarray from the *same* virtual list (same 'l').
        // If we just popped [l..r], the next-best is [l..r-1].
        if (r - 1 >= l) {
            const nextR = r - 1;
            // Find its value in O(log n)
            const [min, max] = tree.query(l, nextR);
            const nextVal = max - min;
            // Add it to the heap. It will compete with the other list heads.
            heap.enqueue({ val: nextVal, l: l, r: nextR });
        }
    }

    return sum;
}