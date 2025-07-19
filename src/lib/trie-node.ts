/**
 * Represents a node in the Trie.
 */
export class TrieNode {
    /** Indicates if this node is a leaf node. */
    isLeaf: boolean;
    /** A map to store child nodes, keyed by the folder name. */
    children: Map<string, TrieNode>;

    constructor() {
        this.isLeaf = false;
        this.children = new Map<string, TrieNode>();
    }
}
