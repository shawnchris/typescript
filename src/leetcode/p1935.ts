function canBeTypedWords(text: string, brokenLetters: string): number {
    let res = 0;
    let start = 0;
    let end = 0;
    while (start < text.length) {
        end = start;
        let hasBrokenKey = false;
        while (end < text.length) {
            const c = text.charAt(end);
            if (c === ' ') break;
            if (brokenLetters.includes(c)) hasBrokenKey = true;
            end++;
        }
        if (start !== end && !hasBrokenKey) res++;
        start = end;
        while (start < text.length && text.charAt(start) === ' ') start++;
    }
    return res;
};

export function run() {
    console.log(canBeTypedWords("hello world", "ad")); // 1
    console.log(canBeTypedWords("leet code", "lt")); // 1
    console.log(canBeTypedWords("leet code", "e")); // 0
}