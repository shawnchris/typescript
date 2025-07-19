//  Remove Sub-Folders from the Filesystem

// Given a list of folders folder, return the folders after removing all sub-folders in those folders. You may return the answer in any order.
// If a folder[i] is located within another folder[j], it is called a sub-folder of it. A sub-folder of folder[j] must start with folder[j], followed by a "/". For example, "/a/b" is a sub-folder of "/a", but "/b" is not a sub-folder of "/a/b/c".
// The format of a path is one or more concatenated strings of the form: '/' followed by one or more lowercase English letters.
//     For example, "/leetcode" and "/leetcode/problems" are valid paths while an empty string and "/" are not.

// Example 1:
// Input: folder = ["/a","/a/b","/c/d","/c/d/e","/c/f"]
// Output: ["/a","/c/d","/c/f"]
// Explanation: Folders "/a/b" is a subfolder of "/a" and "/c/d/e" is inside of folder "/c/d" in our filesystem.

// Example 2:
// Input: folder = ["/a","/a/b/c","/a/b/d"]
// Output: ["/a"]
// Explanation: Folders "/a/b/c" and "/a/b/d" will be removed because they are subfolders of "/a".

// Example 3:
// Input: folder = ["/a/b/c","/a/b/ca","/a/b/d"]
// Output: ["/a/b/c","/a/b/ca","/a/b/d"]

// Constraints:
//     1 <= folder.length <= 4 * 104
//     2 <= folder[i].length <= 100
//     folder[i] contains only lowercase letters and '/'.
//     folder[i] always starts with the character '/'.
//     Each folder name is unique.

import { TrieNode } from '../lib/trie-node';

function removeSubfolders(folder: string[]): string[] {
    const root = new TrieNode();
    // 1. Build the Trie from all folder paths.
    for (const path of folder) {
        let currentNode = root;
        const folderNames = path.split('/');

        for (const folderName of folderNames) {
            // Skips the empty string from a leading "/" in paths like "/a"
            if (folderName === "") continue;

            // If a child node for the folder name doesn't exist, create it.
            if (!currentNode.children.has(folderName)) {
                currentNode.children.set(folderName, new TrieNode());
            }
            
            // Move to the next node in the path. The `!` asserts that the value is not undefined.
            currentNode = currentNode.children.get(folderName)!;
        }
        // Mark the final node as the end of a folder.
        currentNode.isLeaf = true;
    }

    // 2. Check each path to see if it is a sub-folder.
    const result: string[] = [];
    for (const path of folder) {
        let currentNode = root;
        const folderNames = path.split('/');
        let isSubfolder = false;

        for (let i = 0; i < folderNames.length; i++) {
            const folderName = folderNames[i];
            if (folderName === "") continue;

            const nextNode = currentNode.children.get(folderName)!;

            // If a prefix of the current path is a folder (isLeaf is true)
            // and it's not the full path itself, then the current path is a sub-folder.
            if (nextNode.isLeaf && i < folderNames.length - 1) {
                isSubfolder = true;
                break; // No need to check further for this path.
            }

            currentNode = nextNode;
        }

        // If the path was never identified as a sub-folder, add it to the results.
        if (!isSubfolder) {
            result.push(path);
        }
    }

    return result;
};

export function run() {
    const folders1 = ["/a", "/a/b", "/c/d", "/c/d/e", "/c/f"];
    console.log(removeSubfolders(folders1)); // Output: ["/a", "/c/d", "/c/f"]

    const folders2 = ["/a", "/a/b/c", "/a/b/d"];
    console.log(removeSubfolders(folders2)); // Output: ["/a"]

    const folders3 = ["/a/b/c", "/a/b/ca", "/a/b/d"];
    console.log(removeSubfolders(folders3)); // Output: ["/a/b/c", "/a/b/ca", "/a/b/d"]
}