// 1751. Maximum Number of Events That Can Be Attended II

// You are given an array of events where events[i] = [startDayi, endDayi, valuei]. The ith event starts at startDayi and ends at endDayi, and if you attend this event, you will receive a value of valuei. You are also given an integer k which represents the maximum number of events you can attend.
// You can only attend one event at a time. If you choose to attend an event, you must attend the entire event. Note that the end day is inclusive: that is, you cannot attend two events where one of them starts and the other ends on the same day.
// Return the maximum sum of values that you can receive by attending events.

// Example 1:
// Input: events = [[1,2,4],[3,4,3],[2,3,1]], k = 2
// Output: 7
// Explanation: Choose the green events, 0 and 1 (0-indexed) for a total value of 4 + 3 = 7.

// Example 2:
// Input: events = [[1,2,4],[3,4,3],[2,3,10]], k = 2
// Output: 10
// Explanation: Choose event 2 for a total value of 10.
// Notice that you cannot attend any other event as they overlap, and that you do not have to attend k events.

// Example 3:
// Input: events = [[1,1,1],[2,2,2],[3,3,3],[4,4,4]], k = 3
// Output: 9
// Explanation: Although the events do not overlap, you can only attend 3 events. Pick the highest valued three.

// Constraints:
//     1 <= k <= events.length
//     1 <= k * events.length <= 106
//     1 <= startDayi <= endDayi <= 109
//     1 <= valuei <= 106

function maxValue(events: number[][], k: number): number {
    const n = events.length;
    const dp: number[][] = Array(k + 1).fill([]).map(() => Array(n + 1).fill(0));
    events.sort((a, b) => a[0] - b[0]);

    for (let curIndex = n - 1; curIndex >= 0; --curIndex) {
        const nextIndex = bisectRight(events, events[curIndex][1]);
        for (let count = 1; count <= k; count++) {
            dp[count][curIndex] = Math.max(dp[count][curIndex + 1], events[curIndex][2] + dp[count - 1][nextIndex]);
        }
    }
    return dp[k][0];
};

function bisectRight(events: number[][], target: number) {
    let left = 0;
    let right = events.length;
    while (left < right) {
        const mid = Math.trunc((left + right) / 2);
        if (events[mid][0] <= target) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    return left;
};

export function run() {
    console.log(maxValue([[1, 2, 4], [3, 4, 3], [2, 3, 1]], 2)); // Output: 7
    console.log(maxValue([[1, 2, 4], [3, 4, 3], [2, 3, 10]], 2)); // Output: 10
    console.log(maxValue([[1, 1, 1], [2, 2, 2], [3, 3, 3], [4, 4, 4]], 3)); // Output: 9
}