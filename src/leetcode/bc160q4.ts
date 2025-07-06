// Minimum Stability Factor of Array

// You are given an integer array nums and an integer maxC.
// A subarray is called stable if the highest common factor (HCF) of all its elements is greater than or equal to 2.
// The stability factor of an array is defined as the length of its longest stable subarray.
// You may modify at most maxC elements of the array to any integer.
// Return the minimum possible stability factor of the array after at most maxC modifications. If no stable subarray remains, return 0.

// Note:
//     A subarray is a contiguous sequence of elements within an array.
//     The highest common factor (HCF) of an array is the largest integer that evenly divides all the array elements.
//     A subarray of length 1 is stable if its only element is greater than or equal to 2, since HCF([x]) = x.

// Example 1:
// Input: nums = [3,5,10], maxC = 1
// Output: 1
// Explanation:
//     The stable subarray [5, 10] has HCF = 5, which has a stability factor of 2.
//     Since maxC = 1, one optimal strategy is to change nums[1] to 7, resulting in nums = [3, 7, 10].
//     Now, no subarray of length greater than 1 has HCF >= 2. Thus, the minimum possible stability factor is 1.

// Example 2:
// Input: nums = [2,6,8], maxC = 2
// Output: 1
// Explanation:
//     The subarray [2, 6, 8] has HCF = 2, which has a stability factor of 3.
//     Since maxC = 2, one optimal strategy is to change nums[1] to 3 and nums[2] to 5, resulting in nums = [2, 3, 5].
//     Now, no subarray of length greater than 1 has HCF >= 2. Thus, the minimum possible stability factor is 1.

// Example 3:
// Input: nums = [2,4,9,6], maxC = 1
// Output: 2
// Explanation:
//     The stable subarrays are:
//         [2, 4] with HCF = 2 and stability factor of 2.
//         [9, 6] with HCF = 3 and stability factor of 2.
//     Since maxC = 1, the stability factor of 2 cannot be reduced due to two separate stable subarrays. Thus, the minimum possible stability factor is 2.

// Constraints:
//     1 <= n == nums.length <= 105
//     1 <= nums[i] <= 109
//     0 <= maxC <= n

import { SegmentTree } from '../lib/segment-tree';
/**
 * Calculates the minimum possible stability factor of an array after at most maxC modifications.
 * @param nums - The input array of integers.
 * @param maxC - The maximum number of modifications allowed.
 * @returns The minimum possible stability factor.
 */
function minStable(nums: number[], maxC: number): number {
  const n = nums.length;

  // Pre-build the segment tree once for all checks.
  const st = new SegmentTree(nums);

  /**
   * Checks if it's possible to achieve a stability factor of at most `L`
   * using `maxC` or fewer modifications.
   * This is equivalent to breaking all stable subarrays of length `L + 1`.
   * @param L - The target maximum stability factor.
   * @returns True if possible, false otherwise.
   */
  const check = (L: number): boolean => {
    // A stability factor of 0 means no subarray of length 1 is stable.
    // A subarray [x] is stable if x >= 2. So we must change all elements >= 2.
    if (L === 0) {
      const changesNeeded = nums.filter(num => num >= 2).length;
      return changesNeeded <= maxC;
    }
    
    // If no subarrays of length L+1 exist, it's trivially possible.
    const len = L + 1;
    if (len > n) {
      return true;
    }

    let changes = 0;
    let i = 0;
    // Greedily iterate through all possible windows of size `len`
    while (i <= n - len) {
      // Check if the current window is stable
      if (st.query(i, i + L) >= 2) {
        // If stable, we must perform a modification.
        changes++;
        // By modifying the last element of the window (at i + L),
        // we break this stable subarray and any other overlapping ones
        // ending at or after i + L. We can safely jump our window
        // forward to start after the modification.
        i += len;
      } else {
        // Window is not stable, just slide to the next position.
        i++;
      }
    }

    return changes <= maxC;
  };

  // Binary search for the smallest possible stability factor `L`.
  let low = 0, high = n, ans = n;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (check(mid)) {
      // `mid` is a possible stability factor. Try for an even smaller one.
      ans = mid;
      high = mid - 1;
    } else {
      // `mid` is not achievable. We must allow a larger stability factor.
      low = mid + 1;
    }
  }

  return ans;
}

export function run(): void {
  // Example usage:
  const nums1 = [3, 5, 10];
  const maxC1 = 1;
  console.log(minStable(nums1, maxC1)); // Output: 1

  const nums2 = [2, 6, 8];
  const maxC2 = 2;
  console.log(minStable(nums2, maxC2)); // Output: 1

  const nums3 = [2, 4, 9, 6];
  const maxC3 = 1;
  console.log(minStable(nums3, maxC3)); // Output: 2
}
