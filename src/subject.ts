import { AbstractSubscribable } from "./abstract.subscribable";
import { Distributor } from "./distributors";
import { Publisher } from "./interfaces";

export class Subject<T>
  extends AbstractSubscribable<T>
  implements Publisher<T>
{
  private isDone: boolean = false;

  public throwError(err: Error): void {
    for (let subscriber of this.subscribers) {
      if (subscriber.err) subscriber.err(err);
    }
  }

  public finish(): void {
    this.isDone = true;
    for (let subscriber of this.subscribers) {
      if (subscriber.final) subscriber.final();
    }
  }

  public publish(change: T): void {
    if (this.isDone) {
      throw new Error("this change source is finished");
    }
    for (let subscriber of this.subscribers) {
      subscriber.next(change);
    }
  }

  public asDistributor(): Distributor<T> {
    return new Distributor(this);
  }
}
