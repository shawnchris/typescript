// Split and Merge Array Transformation
// You are given two integer arrays nums1 and nums2, each of length n. You may perform the following split-and-merge operation on nums1 any number of times:

// Choose a subarray nums1[L..R].
// Remove that subarray, leaving the prefix nums1[0..L-1] (empty if L = 0) and the suffix nums1[R+1..n-1] (empty if R = n - 1).
// Re-insert the removed subarray (in its original order) at any position in the remaining array (i.e., between any two elements, at the very start, or at the very end).
// Return the minimum number of split-and-merge operations needed to transform nums1 into nums2.

// Example 1:
// Input: nums1 = [3,1,2], nums2 = [1,2,3]
// Output: 1
// Explanation:
// Split out the subarray [3] (L = 0, R = 0); the remaining array is [1,2].
// Insert [3] at the end; the array becomes [1,2,3].

// Example 2:
// Input: nums1 = [1,1,2,3,4,5], nums2 = [5,4,3,2,1,1]
// Output: 3
// Explanation:
// Remove [1,1,2] at indices 0 - 2; remaining is [3,4,5]; insert [1,1,2] at position 2, resulting in [3,4,1,1,2,5].
// Remove [4,1,1] at indices 1 - 3; remaining is [3,2,5]; insert [4,1,1] at position 3, resulting in [3,2,5,4,1,1].
// Remove [3,2] at indices 0 - 1; remaining is [5,4,1,1]; insert [3,2] at position 2, resulting in [5,4,3,2,1,1].

// Constraints:
// 2 <= n == nums1.length == nums2.length <= 6
// -10^5 <= nums1[i], nums2[i] <= 10^5
// nums2 is a permutation of nums1.

function minSplitMerge(nums1: number[], nums2: number[]): number {
    const n = nums1.length;

    // Helper function to serialize an array into a unique string key
    const serialize = (arr: number[]): string => arr.join(',');

    const startState = serialize(nums1);
    const targetState = serialize(nums2);

    // If we are already at the target, 0 operations are needed.
    if (startState === targetState) {
        return 0;
    }

    // Use a queue for BFS. Each element is [state, cost]
    const queue: [string, number][] = [];
    // Use a Set to keep track of visited states to avoid cycles
    const visited = new Set<string>();

    // Start the BFS from the initial state with cost 0
    queue.push([startState, 0]);
    visited.add(startState);

    while (queue.length > 0) {
        // Dequeue the next state to explore
        const [currentState, cost] = queue.shift()!;
        
        // Deserialize the string state back into an array
        const currentArray = currentState.split(',').map(Number);

        // --- Generate all possible next states from one operation ---

        // 1. Choose every possible subarray nums[L..R]
        for (let L = 0; L < n; L++) {
            for (let R = L; R < n; R++) {
                
                // Extract the subarray
                const subarray = currentArray.slice(L, R + 1);
                
                // Get the remaining parts of the array
                const remaining = currentArray.slice(0, L).concat(currentArray.slice(R + 1));

                // 2. Re-insert the subarray at every possible position `i`
                for (let i = 0; i <= remaining.length; i++) {
                    
                    // Create the new array by inserting the subarray
                    const nextArray = remaining.slice(0, i).concat(subarray).concat(remaining.slice(i));
                    
                    // Serialize the new state
                    const nextState = serialize(nextArray);

                    // 3. Check if this is the target
                    if (nextState === targetState) {
                        // Found the shortest path
                        return cost + 1;
                    }

                    // 4. If not visited, add to queue and visited set
                    if (!visited.has(nextState)) {
                        visited.add(nextState);
                        queue.push([nextState, cost + 1]);
                    }
                }
            }
        }
    }

    // This part should be unreachable given the problem constraints
    // (nums2 is always a permutation of nums1)
    return -1; 
}
