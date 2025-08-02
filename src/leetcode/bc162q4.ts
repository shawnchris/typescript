// Threshold Majority Queries
// You are given an integer array nums of length n and an array queries, where queries[i] = [li, ri, thresholdi].
// Return an array of integers ans where ans[i] is equal to the element in the subarray nums[li...ri] that appears at least thresholdi times, selecting the element with the highest frequency (choosing the smallest in case of a tie), or -1 if no such element exists.

// Example 1:
// Input: nums = [1,1,2,2,1,1], queries = [[0,5,4],[0,3,3],[2,3,2]]
// Output: [1,-1,2]
// Explanation:
// Query	Sub-array	Threshold	Frequency table	Answer
// [0, 5, 4]	[1, 1, 2, 2, 1, 1]	4	1 → 4, 2 → 2	1
// [0, 3, 3]	[1, 1, 2, 2]	3	1 → 2, 2 → 2	-1
// [2, 3, 2]	[2, 2]	2	2 → 2	2

// Example 2:
// Input: nums = [3,2,3,2,3,2,3], queries = [[0,6,4],[1,5,2],[2,4,1],[3,3,1]]
// Output: [3,2,3,2]
// Explanation:
// Query	Sub-array	Threshold	Frequency table	Answer
// [0, 6, 4]	[3, 2, 3, 2, 3, 2, 3]	4	3 → 4, 2 → 3	3
// [1, 5, 2]	[2, 3, 2, 3, 2]	2	2 → 3, 3 → 2	2
// [2, 4, 1]	[3, 2, 3]	1	3 → 2, 2 → 1	3
// [3, 3, 1]	[2]	1	2 → 1	2

// Constraints:
// 1 <= nums.length == n <= 10^4
// 1 <= nums[i] <= 10^9
// 1 <= queries.length <= 5 * 10^4
// queries[i] = [li, ri, thresholdi]
// 0 <= li <= ri < n
// 1 <= thresholdi <= ri - li + 1

/**
 * Answers threshold majority queries on an array.
 * For each query [l, r, threshold], finds the element in nums[l...r] that appears
 * at least `threshold` times. Tie-breaking rules: highest frequency, then smallest value.
 *
 * @param nums The input array of integers.
 * @param queries An array of queries, each [li, ri, thresholdi].
 * @returns An array of answers for each query.
 */
function subarrayMajority(nums: number[], queries: number[][]): number[] {
    const n = nums.length;
    const q = queries.length;

    // 1. Coordinate Compression
    const distinctSortedVals = Array.from(new Set(nums)).sort((a, b) => a - b);
    const valToCompressed = new Map<number, number>();
    for (let i = 0; i < distinctSortedVals.length; i++) {
        valToCompressed.set(distinctSortedVals[i], i);
    }
    const compressedNums = nums.map(v => valToCompressed.get(v)!);
    const distinctN = distinctSortedVals.length;

    // 2. Mo's Algorithm Sorting
    const blockSize = Math.floor(Math.sqrt(n));
    const moQueries = queries.map((query, i) => ({
        l: query[0],
        r: query[1],
        threshold: query[2],
        id: i
    }));

    moQueries.sort((a, b) => {
        const blockA = Math.floor(a.l / blockSize);
        const blockB = Math.floor(b.l / blockSize);
        if (blockA !== blockB) {
            return blockA - blockB;
        }
        return blockA % 2 === 0 ? a.r - b.r : b.r - a.r;
    });

    // 3. Data Structures for Sliding Window
    const answers = new Array<number>(q);
    const counts = new Array<number>(distinctN).fill(0);
    const freqVals = Array.from({ length: n + 1 }, () => new Array<number>());
    const valPosInFreqList = new Array<number>(distinctN).fill(0);

    const add = (idx: number) => {
        const valCompressed = compressedNums[idx];
        const valOriginal = nums[idx];
        const oldFreq = counts[valCompressed];

        if (oldFreq > 0) {
            const list = freqVals[oldFreq];
            const pos = valPosInFreqList[valCompressed];
            const lastVal = list.pop()!;
            if (pos < list.length) {
                list[pos] = lastVal;
                valPosInFreqList[valToCompressed.get(lastVal)!] = pos;
            }
        }

        const newFreq = oldFreq + 1;
        counts[valCompressed] = newFreq;
        valPosInFreqList[valCompressed] = freqVals[newFreq].length;
        freqVals[newFreq].push(valOriginal);
    };

    const remove = (idx: number) => {
        const valCompressed = compressedNums[idx];
        const valOriginal = nums[idx];
        const oldFreq = counts[valCompressed];

        const list = freqVals[oldFreq];
        const pos = valPosInFreqList[valCompressed];
        const lastVal = list.pop()!;
        if (pos < list.length) {
            list[pos] = lastVal;
            valPosInFreqList[valToCompressed.get(lastVal)!] = pos;
        }
        
        const newFreq = oldFreq - 1;
        counts[valCompressed] = newFreq;
        if (newFreq > 0) {
            valPosInFreqList[valCompressed] = freqVals[newFreq].length;
            freqVals[newFreq].push(valOriginal);
        }
    };
    
    let currentL = 0;
    let currentR = -1;

    for (const { l, r, threshold, id } of moQueries) {
        while (currentL > l) add(--currentL);
        while (currentR < r) add(++currentR);
        while (currentL < l) remove(currentL++);
        while (currentR > r) remove(currentR--);

        let ans = -1;
        for (let f = n; f >= threshold; f--) {
            if (freqVals[f].length > 0) {
                let minVal = Infinity;
                for (const v of freqVals[f]) {
                    minVal = Math.min(minVal, v);
                }
                ans = minVal;
                break;
            }
        }
        answers[id] = ans;
    }

    return answers;
}
