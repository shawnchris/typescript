// Count Stable Subarrays
// You are given an integer array nums.
// A subarray of nums is called stable if it contains no inversions, i.e., there is no pair of indices i < j such that nums[i] > nums[j].

// You are also given a 2D integer array queries of length q, where each queries[i] = [li, ri] represents a query. For each query [li, ri], compute the number of stable subarrays that lie entirely within the segment nums[li..ri].
// Return an integer array ans of length q, where ans[i] is the answer to the ith query.​​​​​​​​​​​​​​

// Note:
// A subarray is a contiguous non-empty sequence of elements within an array.
// A single element subarray is considered stable.

// Example 1:
// Input: nums = [3,1,2], queries = [[0,1],[1,2],[0,2]]
// Output: [2,3,4]
// Explanation:​​​​​
// For queries[0] = [0, 1], the subarray is [nums[0], nums[1]] = [3, 1].
// The stable subarrays are [3] and [1]. The total number of stable subarrays is 2.
// For queries[1] = [1, 2], the subarray is [nums[1], nums[2]] = [1, 2].
// The stable subarrays are [1], [2], and [1, 2]. The total number of stable subarrays is 3.
// For queries[2] = [0, 2], the subarray is [nums[0], nums[1], nums[2]] = [3, 1, 2].
// The stable subarrays are [3], [1], [2], and [1, 2]. The total number of stable subarrays is 4.
// Thus, ans = [2, 3, 4].

// Example 2:
// Input: nums = [2,2], queries = [[0,1],[0,0]]
// Output: [3,1]
// Explanation:
// For queries[0] = [0, 1], the subarray is [nums[0], nums[1]] = [2, 2].
// The stable subarrays are [2], [2], and [2, 2]. The total number of stable subarrays is 3.
// For queries[1] = [0, 0], the subarray is [nums[0]] = [2].
// The stable subarray is [2]. The total number of stable subarrays is 1.
// Thus, ans = [3, 1].

// Constraints:
// 1 <= nums.length <= 10^5
// 1 <= nums[i] <= 10^5
// 1 <= queries.length <= 10^5
// queries[i] = [li, ri]
// 0 <= li <= ri <= nums.length - 1

function countStableSubarrays(nums: number[], queries: number[][]): number[] {
    const n = nums.length;

    // Decompose array into maximal non-decreasing segments.
    const starts: number[] = [];
    const ends: number[] = [];
    const tris: number[] = [];
    let i = 0;
    while (i < n) {
        let j = i;
        while (j + 1 < n && nums[j] <= nums[j + 1]) j++;
        starts.push(i);
        ends.push(j);
        const len = j - i + 1;
        tris.push((len * (len + 1)) / 2);
        i = j + 1;
    }

    // prefix sum of tris for fast range sum of whole segments
    const m = tris.length;
    const prefixTri = new Array(m + 1).fill(0);
    for (let k = 0; k < m; k++) prefixTri[k + 1] = prefixTri[k] + tris[k];

    function findSegmentByEnd(x: number): number {
        // first index idx such that ends[idx] >= x
        let lo = 0, hi = ends.length - 1, ans = ends.length;
        while (lo <= hi) {
            const mid = (lo + hi) >> 1;
            if (ends[mid] >= x) {
                ans = mid;
                hi = mid - 1;
            } else lo = mid + 1;
        }
        return ans;
    }

    const res: number[] = [];
    for (const [l, r] of queries) {
        const idxL = findSegmentByEnd(l);
        const idxR = findSegmentByEnd(r);
        if (idxL === idxR) {
            const len = r - l + 1;
            res.push((len * (len + 1)) / 2);
            continue;
        }

        const leftLen = ends[idxL] - l + 1;
        const rightLen = r - starts[idxR] + 1;
        let total = (leftLen * (leftLen + 1)) / 2 + (rightLen * (rightLen + 1)) / 2;
        if (idxR > idxL + 1) {
            total += prefixTri[idxR] - prefixTri[idxL + 1];
        }
        res.push(total);
    }
    return res;
};