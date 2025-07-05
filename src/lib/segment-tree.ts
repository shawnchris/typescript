import { gcd } from './gcd';

/**
 * A Segment Tree data structure designed for efficient range GCD (Greatest Common Divisor) queries.
 */
export class SegmentTree {
  private tree: number[];
  private nums: number[];
  private n: number;

  /**
   * Initializes the Segment Tree and builds it from the input array.
   * @param nums - The input array of numbers.
   */
  constructor(nums: number[]) {
    this.n = nums.length;
    this.nums = nums;
    // The size of the tree array should be roughly 4 times the input size
    this.tree = new Array(4 * this.n).fill(0);
    this.build(0, 0, this.n - 1);
  }

  /**
   * Recursively builds the segment tree.
   * @param node - The index of the current node in the `tree` array.
   * @param start - The starting index of the segment in the original array.
   * @param end - The ending index of the segment in the original array.
   */
  private build(node: number, start: number, end: number): void {
    if (start === end) {
      this.tree[node] = this.nums[start];
      return;
    }
    const mid = Math.floor((start + end) / 2);
    // Recurse on the left child
    this.build(2 * node + 1, start, mid);
    // Recurse on the right child
    this.build(2 * node + 2, mid + 1, end);
    // The parent node's value is the GCD of its children
    this.tree[node] = gcd(this.tree[2 * node + 1], this.tree[2 * node + 2]);
  }

  /**
   * Performs a range GCD query on the segment tree.
   * @param l - The left boundary of the query range.
   * @param r - The right boundary of the query range.
   * @returns The GCD of all elements in the range [l, r].
   */
  public query(l: number, r: number): number {
    return this.queryUtil(0, 0, this.n - 1, l, r);
  }

  /**
   * A utility function for the recursive query logic.
   * @param node - The index of the current node in the `tree` array.
   * @param start - The starting index of the current node's segment.
   * @param end - The ending index of the current node's segment.
   * @param l - The left boundary of the query range.
   * @param r - The right boundary of the query range.
   * @returns The GCD of the intersection of the node's range and the query range.
   */
  private queryUtil(node: number, start: number, end: number, l: number, r: number): number {
    // If the segment is completely outside the query range, return 0 (identity for GCD)
    if (r < start || end < l) {
      return 0;
    }
    // If the segment is completely inside the query range, return its GCD value
    if (l <= start && end <= r) {
      return this.tree[node];
    }
    // If the segment partially overlaps, recurse on children
    const mid = Math.floor((start + end) / 2);
    const p1 = this.queryUtil(2 * node + 1, start, mid, l, r);
    const p2 = this.queryUtil(2 * node + 2, mid + 1, end, l, r);
    return gcd(p1, p2);
  }
}
