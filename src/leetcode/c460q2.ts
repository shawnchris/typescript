// Maximum Number of Subsequences After One Inserting
// You are given a string s consisting of uppercase English letters.
// You are allowed to insert at most one uppercase English letter at any position (including the beginning or end) of the string.
// Return the maximum number of "LCT" subsequences that can be formed in the resulting string after at most one insertion.
// A subsequence is a non-empty string that can be derived from another string by deleting some or no characters without changing the order of the remaining characters.

// Example 1:
// Input: s = "LMCT"
// Output: 2
// Explanation:
// We can insert a "L" at the beginning of the string s to make "LLMCT", which has 2 subsequences, at indices [0, 3, 4] and [1, 3, 4].

// Example 2:
// Input: s = "LCCT"
// Output: 4
// Explanation:
// We can insert a "L" at the beginning of the string s to make "LLCCT", which has 4 subsequences, at indices [0, 2, 4], [0, 3, 4], [1, 2, 4] and [1, 3, 4].

// Example 3:
// Input: s = "L"
// Output: 0
// Explanation:
// Since it is not possible to obtain the subsequence "LCT" by inserting a single letter, the result is 0.

// Constraints:
// 1 <= s.length <= 10^5
// s consists of uppercase English letters.

function numOfSubsequences(s: string): number {
    const n = s.length;

    // --- Step 1: Precompute prefix counts ---
    // prefixL[i]: count of 'L's in s[0...i-1]
    // prefixLC[i]: count of 'LC' subsequences in s[0...i-1]
    const prefixL: number[] = new Array(n + 1).fill(0);
    const prefixLC: number[] = new Array(n + 1).fill(0);

    for (let i = 0; i < n; i++) {
        prefixL[i + 1] = prefixL[i];
        prefixLC[i + 1] = prefixLC[i];

        if (s[i] === 'L') {
            prefixL[i + 1]++;
        } else if (s[i] === 'C') {
            // This 'C' combines with 'L's encountered *before* its current position (s[i])
            // which are captured by prefixL[i].
            prefixLC[i + 1] += prefixL[i];
        }
    }

    // --- Step 2: Precompute suffix counts ---
    // suffixT[i]: count of 'T's in s[i...n-1]
    const suffixT: number[] = new Array(n + 1).fill(0);

    for (let i = n - 1; i >= 0; i--) {
        suffixT[i] = suffixT[i + 1];
        if (s[i] === 'T') {
            suffixT[i]++;
        }
    }

    // --- Step 3: Calculate initial LCT count (without any insertion) ---
    let initialLCT: number = 0;
    let currentL = 0;
    let currentLC = 0;
    for (let i = 0; i < n; i++) {
        if (s[i] === 'L') {
            currentL++;
        } else if (s[i] === 'C') {
            currentLC += currentL;
        } else if (s[i] === 'T') {
            initialLCT += currentLC;
        }
    }

    let maxSubsequences = initialLCT;

    // --- Step 4: Consider inserting 'L' at the beginning ---
    // This forms the string "L" + s.
    // The number of 'L's at any point effectively increases by 1.
    // Calculate LCT for the conceptual string 'L' + s.
    let temp_L_count_for_L_insert = 1; // Start with the inserted 'L'
    let temp_LC_count_for_L_insert = 0;
    let temp_LCT_count_for_L_insert = 0;

    for (let i = 0; i < n; i++) {
        if (s[i] === 'L') {
            temp_L_count_for_L_insert++;
        } else if (s[i] === 'C') {
            temp_LC_count_for_L_insert += temp_L_count_for_L_insert;
        } else if (s[i] === 'T') {
            temp_LCT_count_for_L_insert += temp_LC_count_for_L_insert;
        }
    }
    maxSubsequences = Math.max(maxSubsequences, temp_LCT_count_for_L_insert);

    // --- Step 5: Consider inserting 'C' at any position 'i' (before s[i]) ---
    // The inserted 'C' combines with 'L's before it (prefixL[i])
    // and 'T's after it (suffixT[i]).
    for (let i = 0; i <= n; i++) { // 'i' is the insertion index, from 0 to n
        const additionalLCT = prefixL[i] * suffixT[i];
        maxSubsequences = Math.max(maxSubsequences, initialLCT + additionalLCT);
    }

    // --- Step 6: Consider inserting 'T' at any position 'i' (before s[i]) ---
    // The inserted 'T' combines with 'LC' subsequences before it (prefixLC[i]).
    for (let i = 0; i <= n; i++) { // 'i' is the insertion index, from 0 to n
        const additionalLCT = prefixLC[i];
        maxSubsequences = Math.max(maxSubsequences, initialLCT + additionalLCT);
    }

    return maxSubsequences;
}
