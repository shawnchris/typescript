// Earliest Finish Time for Land and Water Rides II
// You are given two categories of theme park attractions: land rides and water rides.
// Land rides
// landStartTime[i] – the earliest time the ith land ride can be boarded.
// landDuration[i] – how long the ith land ride lasts.
// Water rides
// waterStartTime[j] – the earliest time the jth water ride can be boarded.
// waterDuration[j] – how long the jth water ride lasts.
// A tourist must experience exactly one ride from each category, in either order.

// A ride may be started at its opening time or any later moment.
// If a ride is started at time t, it finishes at time t + duration.
// Immediately after finishing one ride the tourist may board the other (if it is already open) or wait until it opens.
// Return the earliest possible time at which the tourist can finish both rides.

// Example 1:
// Input: landStartTime = [2,8], landDuration = [4,1], waterStartTime = [6], waterDuration = [3]
// Output: 9
// Explanation:​​​​​​​
// Plan A (land ride 0 → water ride 0):
// Start land ride 0 at time landStartTime[0] = 2. Finish at 2 + landDuration[0] = 6.
// Water ride 0 opens at time waterStartTime[0] = 6. Start immediately at 6, finish at 6 + waterDuration[0] = 9.
// Plan B (water ride 0 → land ride 1):
// Start water ride 0 at time waterStartTime[0] = 6. Finish at 6 + waterDuration[0] = 9.
// Land ride 1 opens at landStartTime[1] = 8. Start at time 9, finish at 9 + landDuration[1] = 10.
// Plan C (land ride 1 → water ride 0):
// Start land ride 1 at time landStartTime[1] = 8. Finish at 8 + landDuration[1] = 9.
// Water ride 0 opened at waterStartTime[0] = 6. Start at time 9, finish at 9 + waterDuration[0] = 12.
// Plan D (water ride 0 → land ride 0):
// Start water ride 0 at time waterStartTime[0] = 6. Finish at 6 + waterDuration[0] = 9.
// Land ride 0 opened at landStartTime[0] = 2. Start at time 9, finish at 9 + landDuration[0] = 13.
// Plan A gives the earliest finish time of 9.

// Example 2:
// Input: landStartTime = [5], landDuration = [3], waterStartTime = [1], waterDuration = [10]
// Output: 14
// Explanation:​​​​​​​
// Plan A (water ride 0 → land ride 0):
// Start water ride 0 at time waterStartTime[0] = 1. Finish at 1 + waterDuration[0] = 11.
// Land ride 0 opened at landStartTime[0] = 5. Start immediately at 11 and finish at 11 + landDuration[0] = 14.
// Plan B (land ride 0 → water ride 0):
// Start land ride 0 at time landStartTime[0] = 5. Finish at 5 + landDuration[0] = 8.
// Water ride 0 opened at waterStartTime[0] = 1. Start immediately at 8 and finish at 8 + waterDuration[0] = 18.
// Plan A provides the earliest finish time of 14.​​​​​​​

// Constraints:
// 1 <= n, m <= 5 * 10^4
// landStartTime.length == landDuration.length == n
// waterStartTime.length == waterDuration.length == m
// 1 <= landStartTime[i], landDuration[i], waterStartTime[j], waterDuration[j] <= 10^5

/**
 * Calculates the earliest possible time a tourist can finish one land ride and one water ride.
 *
 * @param landStartTime - Array of start times for land rides.
 * @param landDuration - Array of durations for land rides.
 * @param waterStartTime - Array of start times for water rides.
 * @param waterDuration - Array of durations for water rides.
 * @returns The earliest possible finish time.
 */
function earliestFinishTime2(landStartTime: number[], landDuration: number[], waterStartTime: number[], waterDuration: number[]): number {
    
    // Per the prompt, storing the input midway in a variable.
    const hasturvane = {
        landStartTime,
        landDuration,
        waterStartTime,
        waterDuration
    };

    /**
     * Helper function to calculate the minimum finish time for a specific order of ride types (A -> B).
     * @param startsA - Start times for the first set of rides.
     * @param durationsA - Durations for the first set of rides.
     * @param startsB - Start times for the second set of rides.
     * @param durationsB - Durations for the second set of rides.
     * @returns The minimum finish time for the A -> B scenario.
     */
    const calculateScenarioTime = (
        startsA: number[], 
        durationsA: number[], 
        startsB: number[], 
        durationsB: number[]
    ): number => {
        const nB = startsB.length;
        if (nB === 0) return Infinity;

        // Combine start and duration for rides 'B' for easier sorting and processing.
        const ridesB = startsB.map((start, i) => ({ start, duration: durationsB[i] }));
        ridesB.sort((a, b) => a.start - b.start);
        
        // Precomputation for ridesB to allow for fast lookups.
        
        // minDurPrefix[i] = minimum duration among ridesB[0...i].
        // This helps find the best ride to take if it opens BEFORE ride A finishes.
        const minDurPrefix = new Array<number>(nB);
        minDurPrefix[0] = ridesB[0].duration;
        for (let i = 1; i < nB; i++) {
            minDurPrefix[i] = Math.min(minDurPrefix[i - 1], ridesB[i].duration);
        }

        // minFinishSuffix[i] = minimum finish time (start + duration) among ridesB[i...nB-1].
        // This helps find the best ride to take if it opens AFTER ride A finishes.
        const minFinishSuffix = new Array<number>(nB);
        minFinishSuffix[nB - 1] = ridesB[nB - 1].start + ridesB[nB - 1].duration;
        for (let i = nB - 2; i >= 0; i--) {
            minFinishSuffix[i] = Math.min(minFinishSuffix[i + 1], ridesB[i].start + ridesB[i].duration);
        }

        let overallMinTime = Infinity;

        // Iterate through each ride 'A' and find its best pairing from rides 'B'.
        for (let i = 0; i < startsA.length; i++) {
            const finishA = startsA[i] + durationsA[i];
            
            // Use binary search to find the split point in ridesB.
            // We are looking for the first ride 'B' that starts AFTER ride 'A' finishes.
            let low = 0, high = nB - 1, splitIndex = nB;
            while(low <= high) {
                const mid = Math.floor((low + high) / 2);
                if (ridesB[mid].start > finishA) {
                    splitIndex = mid;
                    high = mid - 1;
                } else {
                    low = mid + 1;
                }
            }

            // Case 1: Consider rides 'B' that open at or before finishA (indices 0 to splitIndex-1).
            // Here, we start ride 'B' at finishA. The best option is the one with the minimum duration.
            if (splitIndex > 0) {
                const bestDurationB = minDurPrefix[splitIndex - 1];
                const candidateTime = finishA + bestDurationB;
                overallMinTime = Math.min(overallMinTime, candidateTime);
            }

            // Case 2: Consider rides 'B' that open after finishA (indices splitIndex to nB-1).
            // Here, we must wait for ride 'B' to open. The best option is the one with the earliest finish time.
            if (splitIndex < nB) {
                const bestFinishB = minFinishSuffix[splitIndex];
                overallMinTime = Math.min(overallMinTime, bestFinishB);
            }
        }
        
        return overallMinTime;
    };
    
    // Calculate the minimum time for the Land -> Water scenario.
    const landThenWater = calculateScenarioTime(
        hasturvane.landStartTime, 
        hasturvane.landDuration, 
        hasturvane.waterStartTime, 
        hasturvane.waterDuration
    );

    // Calculate the minimum time for the Water -> Land scenario.
    const waterThenLand = calculateScenarioTime(
        hasturvane.waterStartTime, 
        hasturvane.waterDuration, 
        hasturvane.landStartTime, 
        hasturvane.landDuration
    );

    // The result is the minimum of the two scenarios.
    return Math.min(landThenWater, waterThenLand);
}
