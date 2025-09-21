// Maximum Total Subarray Value I

// You are given an integer array nums of length n and an integer k.
// You need to choose exactly k non-empty subarrays nums[l..r] of nums. Subarrays may overlap, and the exact same subarray (same l and r) can be chosen more than once.
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
// Choose nums[0..3] = [4, 2, 5, 1]. The maximum is 5 and the minimum is 1, so the value is also 4.
// Choose nums[2..3] = [5, 1]. The maximum is 5 and the minimum is 1, so the value is again 4.
// Adding these gives 4 + 4 + 4 = 12.

// Constraints:
// 1 <= n == nums.length <= 5 * 10^4
// 0 <= nums[i] <= 10^9
// 1 <= k <= 10^5

function maxTotalValue(nums: number[], k: number): number {
  // If the array is empty, no subarrays can be formed.
  if (nums.length === 0) {
    return 0;
  }

  // Find the global maximum and minimum values in the entire array.
  // We can initialize both to the first element.
  let globalMin = nums[0];
  let globalMax = nums[0];

  // Iterate through the array to find the true min and max.
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] < globalMin) {
      globalMin = nums[i];
    }
    if (nums[i] > globalMax) {
      globalMax = nums[i];
    }
  }

  // The maximum possible value for any single subarray is `globalMax - globalMin`.
  // This value is achieved by any subarray that contains at least one instance
  // of the global maximum and at least one instance of the global minimum.
  // For example, the subarray spanning from the index of the first global min
  // to the index of the first global max (or vice-versa) will have this value.
  const maxSingleSubarrayValue = globalMax - globalMin;

  // The problem states we can choose the exact same subarray more than once.
  // To maximize the total value, we should simply choose the subarray with
  // the maximum possible value (`maxSingleSubarrayValue`) exactly k times.
  const totalMaxValue = maxSingleSubarrayValue * k;

  return totalMaxValue;
}
