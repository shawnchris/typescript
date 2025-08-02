// Minimum Removals to Balance Array
// You are given an integer array nums and an integer k.
// An array is considered balanced if the value of its maximum element is at most k times the minimum element.
// You may remove any number of elements from nums​​​​​​​ without making it empty.
// Return the minimum number of elements to remove so that the remaining array is balanced.
// Note: An array of size 1 is considered balanced as its maximum and minimum are equal, and the condition always holds true.

// Example 1:
// Input: nums = [2,1,5], k = 2
// Output: 1
// Explanation:
// Remove nums[2] = 5 to get nums = [2, 1].
// Now max = 2, min = 1 and max <= min * k as 2 <= 1 * 2. Thus, the answer is 1.

// Example 2:
// Input: nums = [1,6,2,9], k = 3
// Output: 2
// Explanation:
// Remove nums[0] = 1 and nums[3] = 9 to get nums = [6, 2].
// Now max = 6, min = 2 and max <= min * k as 6 <= 2 * 3. Thus, the answer is 2.

// Example 3:
// Input: nums = [4,6], k = 2
// Output: 0
// Explanation:
// Since nums is already balanced as 6 <= 4 * 2, no elements need to be removed.

// Constraints:
// 1 <= nums.length <= 10^5
// 1 <= nums[i] <= 10^9
// 1 <= k <= 10^5

/**
 * Calculates the minimum number of elements to remove from an array
 * to make it balanced. An array is balanced if its maximum element
 * is at most k times its minimum element.
 *
 * @param nums - The input array of integers.
 * @param k - The balance factor.
 * @returns The minimum number of removals required.
 */
function minRemoval(nums: number[], k: number): number {
    // Sort the array in non-decreasing order.
    nums.sort((a, b) => a - b);

    const n = nums.length;
    if (n <= 1) {
        return 0; // An array with 0 or 1 element is always balanced.
    }

    let maxLength = 0;
    let left = 0;

    // Use a sliding window to find the longest balanced subarray.
    for (let right = 0; right < n; right++) {
        // The current window is from index `left` to `right`.
        // The minimum is nums[left] and the maximum is nums[right].
        // Check if the window is balanced.
        // If nums[right] > nums[left] * k, the window is not balanced.
        // We must shrink the window from the left by incrementing `left`.
        while (nums[right] > nums[left] * k) {
            left++;
        }

        // At this point, the window from `left` to `right` is balanced.
        // Calculate its length and update the maximum length found so far.
        const currentLength = right - left + 1;
        maxLength = Math.max(maxLength, currentLength);
    }

    // The minimum number of removals is the total length minus the
    // length of the largest balanced subarray we can form.
    return n - maxLength;
}
