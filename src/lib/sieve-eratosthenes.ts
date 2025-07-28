export function sieveOfEratosthenes(n: number): boolean[] {
    const isPrime = new Array(n).fill(true);
    isPrime[0] = false; // 0 is not a prime number
    isPrime[1] = false; // 1 is not a prime number

    for (let p = 2; p * p < n; p++) {
        if (isPrime[p]) {
            for (let i = p * p; i < n; i += p) {
                isPrime[i] = false;
            }
        }
    }
    return isPrime;
}