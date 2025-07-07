// 1353. Maximum Number of Events That Can Be Attended

// You are given an array of events where events[i] = [startDayi, endDayi]. Every event i starts at startDayi and ends at endDayi.
// You can attend an event i at any day d where startTimei <= d <= endTimei. You can only attend one event at any time d.
// Return the maximum number of events you can attend.

// Example 1:
// Input: events = [[1,2],[2,3],[3,4]]
// Output: 3
// Explanation: You can attend all the three events.
// One way to attend them all is as shown.
// Attend the first event on day 1.
// Attend the second event on day 2.
// Attend the third event on day 3.

// Example 2:
// Input: events= [[1,2],[2,3],[3,4],[1,2]]
// Output: 4

// Constraints:
//     1 <= events.length <= 10^5
//     events[i].length == 2
//     1 <= startDayi <= endDayi <= 10^5

import { MinPriorityQueue } from '@datastructures-js/priority-queue';

function maxEvents(events: number[][]): number {
    const n = events.length;
    let maxDay = 0;
    for (const e of events) {
        maxDay = Math.max(maxDay, e[1]);
    }
    events.sort((a, b) => a[0] - b[0]);
    const pq = new MinPriorityQueue<number>();
    let ans = 0;
    for (let i = 1, j = 0; i <= maxDay; i++) {
        while (j < n && events[j][0] <= i) {
            pq.enqueue(events[j][1]);
            j++;
        }
        while (!pq.isEmpty() && pq.front() < i) {
            pq.dequeue();
        }
        if (!pq.isEmpty()) {
            pq.dequeue();
            ans++;
        }
    }
    return ans;
}

export function run() {
  console.log(
    maxEvents([
      [1, 2],
      [2, 3],
      [3, 4],
    ])
  ); // Output: 3
  console.log(
    maxEvents([
      [1, 2],
      [2, 3],
      [3, 4],
      [1, 2],
    ])
  ); // Output: 4
  console.log(
    maxEvents([
      [1, 5],
      [1, 5],
      [1, 5],
      [2, 3],
      [2, 3],
    ])
  ); // Output: 5
  console.log(
    maxEvents([
      [1, 2],
      [1, 2],
      [1, 6],
      [1, 2],
      [1, 2],
    ])
  ); // Output: 3
}
