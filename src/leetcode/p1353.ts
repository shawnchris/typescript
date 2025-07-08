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

import { ICompare, MinPriorityQueue, PriorityQueue } from "@datastructures-js/priority-queue";

function maxEvents(events: number[][]): number {
    const n = events.length;
    let maxDay = 0;
    for (const e of events) {
        maxDay = Math.max(maxDay, e[1]);
    }
    events.sort((a, b) => a[0] - b[0]);
    const pq = new MinPriorityQueue<number>();
    let ans = 0;
    for (let day = 1, event = 0; day <= maxDay; day++) {
        while (event < n && events[event][0] <= day) {
            pq.enqueue(events[event][1]);
            event++;
        }
        while (!pq.isEmpty() && pq.front() < day) {
            pq.dequeue();
        }
        if (!pq.isEmpty()) {
            pq.dequeue();
            ans++;
        }
    }
    return ans;
}

function maxEventsTle(events: number[][]): number {
  interface ICar {
    year: number;
    price: number;
  }

  const compareCars: ICompare<ICar> = (a: ICar, b: ICar) => {
    if (a.year > b.year) {
      return -1;
    }
    if (a.year < b.year) {
      // prioritize newest cars
      return 1;
    }
    // with lowest price
    return a.price < b.price ? -1 : 1;
  };

  const carsQueue = new PriorityQueue<ICar>(compareCars);
  
  const pq = new PriorityQueue<number[]>((a: number[], b: number[]) =>
    a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]
  );

  for (const event of events) {
    pq.enqueue(event);
  }

  let count = 0;
  while (pq.size() > 0) {
    const [start, end] = pq.dequeue()!;
    count++; // Attend this event
    while (pq.size() > 0 && pq.front()[0] === start) {
      const nextEvent = pq.dequeue()!;
      if (nextEvent[1] > start) {
        pq.enqueue([nextEvent[0] + 1, nextEvent[1]]);
      }
    }
  }
  return count; // Return the total count of attended events
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
