import { AbstractSubscribable } from "../abstract.subscribable";
import { Distributor } from "../distributor/distributor";
import { Publisher } from "../interfaces";

export class Subject<T>
  extends AbstractSubscribable<T>
  implements Publisher<T>
{
  protected completed: boolean = false;

  public throwError(err: Error): void {
    for (let subscriber of this.subscribers) {
      if (subscriber.err) subscriber.err(err);
    }
  }

  public complete(): void {
    this.completed = true;
    for (let subscriber of this.subscribers) {
      if (subscriber.final) subscriber.final();
    }
    this.subscribers = [];
  }

  public publish(event: T): void {
    if (this.completed) {
      throw new Error("this subject source completed");
    }
    for (let subscriber of this.subscribers) {
      subscriber.next(event);
    }
  }

  public asDistributor(): Distributor<T> {
    return new Distributor(this);
  }

  isComplete(): boolean {
    return this.completed;
  }
}
