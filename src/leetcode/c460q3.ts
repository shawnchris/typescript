// Minimum Jumps to Reach End via Prime Teleportation
// You are given an integer array nums of length n.
// You start at index 0, and your goal is to reach index n - 1.
// From any index i, you may perform one of the following operations:
// Adjacent Step: Jump to index i + 1 or i - 1, if the index is within bounds.
// Prime Teleportation: If nums[i] is a prime number p, you may instantly jump to any index j != i such that nums[j] % p == 0.
// Return the minimum number of jumps required to reach index n - 1.

// A prime number is a natural number greater than 1 with only two factors, 1 and itself.

// Example 1:
// Input: nums = [1,2,4,6]
// Output: 2
// Explanation:
// One optimal sequence of jumps is:
// Start at index i = 0. Take an adjacent step to index 1.
// At index i = 1, nums[1] = 2 is a prime number. Therefore, we teleport to index i = 3 as nums[3] = 6 is divisible by 2.
// Thus, the answer is 2.

// Example 2:
// Input: nums = [2,3,4,7,9]
// Output: 2
// Explanation:
// One optimal sequence of jumps is:
// Start at index i = 0. Take an adjacent step to index i = 1.
// At index i = 1, nums[1] = 3 is a prime number. Therefore, we teleport to index i = 4 since nums[4] = 9 is divisible by 3.
// Thus, the answer is 2.

// Example 3:
// Input: nums = [4,6,5,8]
// Output: 3
// Explanation:
// Since no teleportation is possible, we move through 0 → 1 → 2 → 3. Thus, the answer is 3.

// Constraints:
// 1 <= n == nums.length <= 10^5
// 1 <= nums[i] <= 10^6

import { sieveOfEratosthenes } from '../lib/sieve-eratosthenes';

function minJumps(nums: number[]): number {
    const n = nums.length;
    const maxNum = Math.max(...nums);
    const isPrime = sieveOfEratosthenes(maxNum);

    // This map stores for each prime 'p', a list of indices 'j' such that nums[j] % p === 0.
    const primeToIndicesMap = new Map<number, number[]>();

    // Populate primeToIndicesMap
    for (let i = 0; i < n; i++) {
        const num = nums[i];
        // Find prime factors of num and add index i to their lists
        // Efficiently find prime factors of num
        let tempNum = num;
        for (let p = 2; p * p <= tempNum; p++) {
            if (tempNum % p === 0) {
                if (isPrime[p]) { // Only consider actual prime factors
                    if (!primeToIndicesMap.has(p)) {
                        primeToIndicesMap.set(p, []);
                    }
                    primeToIndicesMap.get(p)!.push(i);
                }
                while (tempNum % p === 0) {
                    tempNum /= p;
                }
            }
        }
        if (tempNum > 1 && isPrime[tempNum]) { // If tempNum is still > 1, it's a prime factor itself
            if (!primeToIndicesMap.has(tempNum)) {
                primeToIndicesMap.set(tempNum, []);
            }
            primeToIndicesMap.get(tempNum)!.push(i);
        }
    }


    const queue: [number, number][] = [[0, 0]]; // [index, jumps]
    const visited = new Array(n).fill(false);
    visited[0] = true;

    // This set prevents re-processing prime teleportations from the same prime factor.
    // If we process teleportations for prime 'p', we don't need to do it again,
    // even if we reach another index whose value is also divisible by 'p'.
    const processedPrimes = new Set<number>(); 

    let head = 0;
    while(head < queue.length) {
        const [currentIndex, jumps] = queue[head++];

        if (currentIndex === n - 1) {
            return jumps;
        }

        // Adjacent Step: i + 1
        if (currentIndex + 1 < n && !visited[currentIndex + 1]) {
            visited[currentIndex + 1] = true;
            queue.push([currentIndex + 1, jumps + 1]);
        }

        // Adjacent Step: i - 1
        if (currentIndex - 1 >= 0 && !visited[currentIndex - 1]) {
            visited[currentIndex - 1] = true;
            queue.push([currentIndex - 1, jumps + 1]);
        }

        // Prime Teleportation
        const currentNum = nums[currentIndex];
        // Only trigger teleportation if currentNum is prime and we haven't processed this prime for teleportation yet
        if (isPrime[currentNum] && !processedPrimes.has(currentNum)) {
            processedPrimes.add(currentNum); // Mark this prime as processed
            
            const teleportTargets = primeToIndicesMap.get(currentNum) || [];
            for (const targetIndex of teleportTargets) {
                // We can jump to any index j != i, but BFS inherently handles distinct targets
                if (!visited[targetIndex]) { // Ensure we don't re-visit already visited nodes
                    visited[targetIndex] = true;
                    queue.push([targetIndex, jumps + 1]);
                }
            }
        }
    }

    // This return -1 should ideally not be reached if n >= 1,
    // as adjacent steps always allow reaching n-1, albeit not optimally.
    return -1; 
}

export function run() {
    const nums1 = [1, 2, 4, 6];
    console.log(minJumps(nums1)); // Output: 2
    const nums2 = [2, 3, 4, 7, 9];
    console.log(minJumps(nums2)); // Output: 2
    const nums3 = [4, 6, 5, 8];
    console.log(minJumps(nums3)); // Output: 3
}