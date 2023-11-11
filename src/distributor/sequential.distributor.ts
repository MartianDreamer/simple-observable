import {Subscribable, Subscriber, Subscription} from "../interfaces";
import {MultiSourceDistributor} from './multi.source.distributor';

export class SequentialDistributor<T> extends MultiSourceDistributor<T> {
  private currentSourceIndex: number = 0;
  protected sourceSubscriber: Subscriber<T> = {
    next: (event: T) => {
      this.subscribers.forEach((subscriber: Subscriber<T>) => {
        subscriber.next(event);
      });
    },
    err: (err: Error) => {
      this.subscribers.forEach((subscriber: Subscriber<T>) => {
        if (subscriber.err) subscriber.err(err);
      });
    },
    complete: () => {
      //if this source is not the last source, subscribe the next source, else call the final methods of subscribers.
      if (this.currentSourceIndex < this.sourceSubscriptions.length - 1) {
        this.currentSourceIndex += 1;
        this.sourceSubscriptions[this.currentSourceIndex].subscription = this.sourceSubscriptions[this.currentSourceIndex].source.subscribe(this.sourceSubscriber);
      } else {
        this.subscribers.forEach((subscriber: Subscriber<T>) => {
          if (subscriber.complete) subscriber.complete();
        });
      }
    },
  };

  constructor(...sources: Subscribable<T>[]) {
    super(sources);
  }

  public subscribe(subscriber: Subscriber<T>): Subscription {
    if (this.sourceSubscriptions[0] && !this.isStreaming) {
      this.sourceSubscriptions[0].subscription = this.sourceSubscriptions[0].source.subscribe(this.sourceSubscriber);
    }
    this.subscribers = [...this.subscribers, subscriber];
    return {
      unsubscribe: () => {
        this.subscribers = this.subscribers.filter((e) => e !== subscriber);
      },
    };
  }
}
