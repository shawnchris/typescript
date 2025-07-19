// Convert Binary Number in a Linked List to Integer

// Given head which is a reference node to a singly-linked list. The value of each node in the linked list is either 0 or 1. The linked list holds the binary representation of a number.
// Return the decimal value of the number in the linked list.
// The most significant bit is at the head of the linked list.

 

// Example 1:
// Input: head = [1,0,1]
// Output: 5
// Explanation: (101) in base 2 = (5) in base 10

// Example 2:
// Input: head = [0]
// Output: 0

// Constraints:
//     The Linked List is not empty.
//     Number of nodes will not exceed 30.
//     Each node's value is either 0 or 1.

import {ListNode} from '../lib/list-node';

function getDecimalValue(head: ListNode | null): number {
    let result = 0;
    let current = head;
    while (current) {
        result = (result << 1) | current.val;
        current = current.next;
    }
    return result;
};

export function run() {
    const head = new ListNode(1, new ListNode(0, new ListNode(1)));
    console.log(getDecimalValue(head)); // Output: 5

    const head2 = new ListNode(0);
    console.log(getDecimalValue(head2)); // Output: 0
}