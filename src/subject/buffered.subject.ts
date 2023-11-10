import { AbstractSubscribable } from "../abstract.subscribable";
import { Distributor } from "../distributor/distributor";
import { Publisher, Subscriber, Subscription } from "../interfaces";

export class BufferedSubject<T>
  extends AbstractSubscribable<T>
  implements Publisher<T>
{
  protected isDone: boolean = false;
  private buffer: T[] = [];
  constructor(private size: number) {
    super();
  }

  publish(event: T): void {
    if (this.isDone) {
      throw new Error("this change source is finished");
    }
    if (this.buffer.length === this.size) {
      this.buffer = [...this.buffer.slice(1, this.size), event];
    } else {
      this.buffer.push(event);
    }
    for (let subscriber of this.subscribers) {
      subscriber.next(event);
    }
  }

  public subscribe(subscriber: Subscriber<T>): Subscription {
    for (const event of this.buffer) {
      subscriber.next(event);
    }
    return super.subscribe(subscriber);
  }

  public throwError(err: Error): void {
    for (let subscriber of this.subscribers) {
      if (subscriber.err) subscriber.err(err);
    }
  }

  public complete(): void {
    this.isDone = true;
    for (let subscriber of this.subscribers) {
      if (subscriber.final) subscriber.final();
    }
    this.subscribers = [];
  }

  public asDistributor(): Distributor<T> {
    return new Distributor(this);
  }
}
