// Maximum Median Sum of Subsequences of Size 3
// You are given an integer array nums with a length divisible by 3.
// You want to make the array empty in steps. In each step, you can select any three elements from the array, compute their median, and remove the selected elements from the array.
// The median of an odd-length sequence is defined as the middle element of the sequence when it is sorted in non-decreasing order.
// Return the maximum possible sum of the medians computed from the selected elements.

// Example 1:
// Input: nums = [2,1,3,2,1,3]
// Output: 5
// Explanation:
// In the first step, select elements at indices 2, 4, and 5, which have a median 3. After removing these elements, nums becomes [2, 1, 2].
// In the second step, select elements at indices 0, 1, and 2, which have a median 2. After removing these elements, nums becomes empty.
// Hence, the sum of the medians is 3 + 2 = 5.

// Example 2:
// Input: nums = [1,1,10,10,10,10]
// Output: 20
// Explanation:
// In the first step, select elements at indices 0, 2, and 3, which have a median 10. After removing these elements, nums becomes [1, 10, 10].
// In the second step, select elements at indices 0, 1, and 2, which have a median 10. After removing these elements, nums becomes empty.
// Hence, the sum of the medians is 10 + 10 = 20.

// Constraints:
// 1 <= nums.length <= 5 * 10^5
// nums.length % 3 == 0
// 1 <= nums[i] <= 10^9

function maximumMedianSum(nums: number[]): number {
    // 1. Sort the array in non-decreasing order.
    // This step is crucial as it allows us to pick elements efficiently from the ends.
    nums.sort((a, b) => a - b);

    let totalMedianSum: number = 0;
    const n = nums.length;

    // The number of medians we will pick is N/3, since each step removes 3 elements.
    const numberOfMedians = n / 3;

    // The optimal strategy is to pick the second-to-last, fourth-to-last,
    // sixth-to-last elements, and so on, from the sorted array as medians.
    // This is because we pair them with the absolute largest remaining element (as 'c')
    // and the smallest available element (as 'a'), maximizing the median 'b'.
    //
    // For a sorted array [n_0, n_1, ..., n_{N-1}]:
    // - The first median picked will be nums[N-2].
    // - The second median picked will be nums[N-4].
    // - The third median picked will be nums[N-6], and so on.
    //
    // The general index for the i-th median (0-indexed) will be: N - 2 - (i * 2)
    // We loop 'numberOfMedians' times to get all the medians.
    for (let i = 0; i < numberOfMedians; i++) {
        // Calculate the index of the current median based on the pattern
        const medianIndex = n - 2 - (i * 2);
        totalMedianSum += nums[medianIndex];
    }

    return totalMedianSum;
};