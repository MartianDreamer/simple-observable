export class Iterator<T> {
  private index: number = 0;
  constructor(private arr: T[]) {}

  public hasNext(): boolean {
    return this.index < this.arr.length;
  }

  public next(): T {
    return this.arr[this.index++];
  }
}
