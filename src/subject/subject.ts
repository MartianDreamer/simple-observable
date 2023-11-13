import {Distributor, Publisher, Subscribable, Subscriber, Subscription} from "../interfaces";
import {SingleSourceDistributor} from '../distributor/single.source.distributor';

export class Subject<T>
  implements Publisher<T>, Subscribable<T> {
  protected completed: boolean = false;
  protected subscribers: Subscriber<T>[] = [];

  public subscribe(subscriber: Subscriber<T>): Subscription {
    this.subscribers = [...this.subscribers, subscriber];
    if (this.completed && subscriber.complete) {
      subscriber.complete();
    }
    return {
      unsubscribe: () => {
        this.subscribers = this.subscribers.filter((e: Subscriber<T>) => e !== subscriber)
      },
    };
  }

  public throwError(err: Error): void {
    for (let subscriber of this.subscribers) {
      if (subscriber.err) subscriber.err(err);
    }
  }

  public complete(): void {
    this.completed = true;
    for (let subscriber of this.subscribers) {
      if (subscriber.complete) subscriber.complete();
    }
    this.subscribers = [];
  }

  public publish(event: T): void {
    if (this.completed) {
      throw new Error("this subject completed");
    }
    for (let subscriber of this.subscribers) {
      subscriber.next(event);
    }
  }

  public asDistributor(): Distributor<T> {
    return new SingleSourceDistributor(this);
  }

  isComplete(): boolean {
    return this.completed;
  }
}
