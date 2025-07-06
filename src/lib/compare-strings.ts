export function compareStrings(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const minLength = Math.min(len1, len2);

  for (let i = 0; i < minLength; i++) {
    const charCode1 = str1.charCodeAt(i);
    const charCode2 = str2.charCodeAt(i);

    if (charCode1 < charCode2) {
      return -1; // str1 is smaller
    }
    if (charCode1 > charCode2) {
      return 1; // str1 is larger
    }
  }
  if (len1 < len2) {
    return -1; // str1 is shorter
  }
  if (len1 > len2) {
    return 1; // str1 is longer
  }

  return 0;
}
