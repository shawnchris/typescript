export class UF {
    private parent: number[];
    private rank: number[];
    private count: number;
  
    constructor(numberOfElements: number) {
      this.parent = [];
      this.rank = [];
      this.count = numberOfElements;
      for (let i = 0; i < numberOfElements; i++) {
        this.parent[i] = i;
        this.rank[i] = 0;
      }
    }
  
    public find(p: number) {
      // my version of compression find
      if (this.parent[p] == p) return p;
  
      let q: number = p;
      while (this.parent[q] != q) {
        q = this.parent[q];
      }
      this.parent[p] = q;
      return q;
    }
  
    public union(p: number, q: number) {
      const rootP = this.find(p);
      const rootQ = this.find(q);
      if (rootP == rootQ) return;
  
      if (this.rank[rootP] > this.rank[rootQ]) this.parent[rootQ] = rootP;
      else if (this.rank[rootP] < this.rank[rootQ]) this.parent[rootP] = rootQ;
      else {
        this.parent[rootQ] = rootP;
        this.rank[rootP]++;
      }
      this.count--;
    }
  
    public getCount() {
      return this.count;
    }
}