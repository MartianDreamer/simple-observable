import { Subscribable, Subscriber, Subscription } from "../interfaces";
import { AbstractDistributor } from "./abstract.distributor";

export class SequentialDistributor<T> extends AbstractDistributor<T> {
  private current: Subscribable<T>
  private source2Memory: (T | Error)[] = []

  constructor(private readonly dataSource1: Subscribable<T>, private readonly dataSource2: Subscribable<T>) {
    super()
    this.current = dataSource1
    this.dataSource2.subscribe({
      next: (v: T) => this.source2Memory.push(v),
      err: (e: Error) => this.source2Memory.push(e),
      complete: () => this.complete()
    })
  }

  public subscribe(subscriber: Subscriber<T>): Subscription {
    throw new Error("Method not implemented.");
  }

  private complete(): void {

  }
}
