// Coupon Code Validator

// You are given three arrays of length n that describe the properties of n coupons: code, businessLine, and isActive. The ith coupon has:
//     code[i]: a string representing the coupon identifier.
//     businessLine[i]: a string denoting the business category of the coupon.
//     isActive[i]: a boolean indicating whether the coupon is currently active.
// A coupon is considered valid if all of the following conditions hold:
//     code[i] is non-empty and consists only of alphanumeric characters (a-z, A-Z, 0-9) and underscores (_).
//     businessLine[i] is one of the following four categories: "electronics", "grocery", "pharmacy", "restaurant".
//     isActive[i] is true.
// Return an array of the codes of all valid coupons, sorted first by their businessLine in the order: "electronics", "grocery", "pharmacy", "restaurant", and then by code in lexicographical (ascending) order within each category.

// Example 1:
// Input: code = ["SAVE20","","PHARMA5","SAVE@20"], businessLine = ["restaurant","grocery","pharmacy","restaurant"], isActive = [true,true,true,true]
// Output: ["PHARMA5","SAVE20"]
// Explanation:
//     First coupon is valid.
//     Second coupon has empty code (invalid).
//     Third coupon is valid.
//     Fourth coupon has special character @ (invalid).

// Example 2:
// Input: code = ["GROCERY15","ELECTRONICS_50","DISCOUNT10"], businessLine = ["grocery","electronics","invalid"], isActive = [false,true,true]
// Output: ["ELECTRONICS_50"]
// Explanation:
//     First coupon is inactive (invalid).
//     Second coupon is valid.
//     Third coupon has invalid business line (invalid).

// Constraints:
//     n == code.length == businessLine.length == isActive.length
//     1 <= n <= 100
//     0 <= code[i].length, businessLine[i].length <= 100
//     code[i] and businessLine[i] consist of printable ASCII characters.
//     isActive[i] is either true or false.

import { compareStrings } from '../lib/compare-strings';

function validateCoupons(code: string[], businessLine: string[], isActive: boolean[]): string[] {
    const vbl = new Set(["electronics", "grocery", "pharmacy", "restaurant"]);
    const vc: {code: string, index: number}[] = [];

    for (let i = 0; i < code.length; i++) {
        const c = code[i];
        const bl = businessLine[i];
        const active = isActive[i];

        // Check if the coupon is valid
        if (c && /^[a-zA-Z0-9_]+$/.test(c) && vbl.has(bl) && active) {
            vc.push({code: c, index: i});
        }
    }

    // Sort by business line and then by code
    vc.sort((a, b) => {
        const blA = businessLine[a.index];
        const blB = businessLine[b.index];

        const order = ["electronics", "grocery", "pharmacy", "restaurant"];
        return order.indexOf(blA) - order.indexOf(blB) || compareStrings(a.code, b.code);
    });

    return vc.map(item => item.code);
};

export function run() {
   const code = ["SAVE20","","PHARMA5","SAVE@20"];
   const businessLine = ["restaurant","grocery","pharmacy","restaurant"];
   const isActive = [true,true,true,true];
   const result = validateCoupons(code, businessLine, isActive);
   console.log(result); // Output: ["PHARMA5","SAVE20"]
   const code2 = ["GROCERY15","ELECTRONICS_50","DISCOUNT10"];
   const businessLine2 = ["grocery","electronics","invalid"];
   const isActive2 = [false,true,true];
   const result2 = validateCoupons(code2, businessLine2, isActive2);
   console.log(result2); // Output: ["ELECTRONICS_50"]
   const code3 = ["MI","b_"];
   const businessLine3 = ["pharmacy","pharmacy"];
   const isActive3 = [true, true];
   const result3 = validateCoupons(code3, businessLine3, isActive3);
   console.log(result3); // Output: ["MI","b_"]
   const code4 = ["Z","T","P","8","5","r","n","6","n","5","R"];
   const businessLine4 = ["pharmacy","restaurant","grocery","invalid","pharmacy","pharmacy","grocery","invalid","pharmacy","invalid","grocery"];
   const isActive4 = [false,true,false,false,true,true,false,false,true,true,true];
   const result4 = validateCoupons(code4, businessLine4, isActive4);
   console.log(result4); // ["R","n","5","r","T"]
}