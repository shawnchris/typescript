/**
 * A simple Min-Priority Queue implementation for Dijkstra's algorithm.
 * It stores tuples of [priority, value].
 * The queue always surfaces the element with the lowest priority (value).
 */
class MinPriorityQueue {
  private heap: [number, number][];

  constructor() {
    this.heap = [];
  }

  /**
   * Adds an element to the queue.
   * @param element - A tuple [time, node].
   */
  enqueue(element: [number, number]): void {
    this.heap.push(element);
    this.bubbleUp();
  }

  /**
   * Removes and returns the element with the highest priority (lowest time).
   * @returns The [time, node] tuple with the minimum time.
   */
  dequeue(): [number, number] {
    const min = this.heap[0];
    const end = this.heap.pop();
    if (this.heap.length > 0 && end) {
      this.heap[0] = end;
      this.sinkDown();
    }
    return min;
  }

  /**
   * Checks if the priority queue is empty.
   * @returns True if the queue is empty, false otherwise.
   */
  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  /**
   * Moves a new element up the heap to its correct position.
   */
  private bubbleUp(): void {
    let index = this.heap.length - 1;
    const element = this.heap[index];
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      const parent = this.heap[parentIndex];
      if (element[0] >= parent[0]) break;
      this.heap[index] = parent;
      this.heap[parentIndex] = element;
      index = parentIndex;
    }
  }

  /**
   * Moves the root element down the heap to its correct position after a dequeue.
   */
  private sinkDown(): void {
    let index = 0;
    const length = this.heap.length;
    const element = this.heap[0];
    while (true) {
      const leftChildIndex = 2 * index + 1;
      const rightChildIndex = 2 * index + 2;
      let leftChild: [number, number] | undefined;
      let rightChild: [number, number] | undefined;
      let swap: number | null = null;

      if (leftChildIndex < length) {
        leftChild = this.heap[leftChildIndex];
        if (leftChild[0] < element[0]) {
          swap = leftChildIndex;
        }
      }

      if (rightChildIndex < length) {
        rightChild = this.heap[rightChildIndex];
        if (
          (swap === null && rightChild[0] < element[0]) ||
          (swap !== null && leftChild && rightChild[0] < leftChild[0])
        ) {
          swap = rightChildIndex;
        }
      }

      if (swap === null) break;
      this.heap[index] = this.heap[swap];
      this.heap[swap] = element;
      index = swap;
    }
  }
}
