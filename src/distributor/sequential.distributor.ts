import {Subscriber, Subscription} from "../interfaces";
import {Distributor} from "./distributor";

export class SequentialDistributor<T> extends Distributor<T> {
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
    final: () => {
      //if this source is not the last source, subscribe the next source, else call the final methods of subscribers.
      if (this.currentSourceIndex !== this.sources.length - 1) {
        this.currentSourceIndex += 1;
        this.sources[this.currentSourceIndex].subscription = this.sources[this.currentSourceIndex].source.subscribe(this.sourceSubscriber);
      } else {
        this.subscribers.forEach((subscriber: Subscriber<T>) => {
          if (subscriber.final) subscriber.final();
        });
      }
    },
  };

  public subscribe(subscriber: Subscriber<T>): Subscription {
    if (this.sources[0] && !this.joinedSources) {
      this.sources[0].subscription = this.sources[0].source.subscribe(this.sourceSubscriber);
    }
    this.subscribers = [...this.subscribers, subscriber];
    return {
      unsubscribe: () => {
        this.subscribers = this.subscribers.filter((e) => e !== subscriber);
      },
    };
  }
}
