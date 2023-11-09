import { Subscriber, Subscription } from "../interfaces";
import { Distributor } from "./distributor";

export class SequentialDistributor<T> extends Distributor<T> {
  public subscribe(subscriber: Subscriber<T>): Subscription {
    let i: number = 0;
    if (this.sources[i] && !this.subscribedSources) {
      this.subscribedSources = true;
      const sourceSubscriber: Subscriber<T> = {
        ...this.sourceSubscriber,
        final: () => {
          if (i !== this.sources.length - 1) {
            i += 1;
            this.sources[i].subscribe(sourceSubscriber);
          } else {
            this.subscribers.forEach((subscriber: Subscriber<T>) => {
              if (subscriber.final) subscriber.final();
            });
          }
        },
      };
      this.sources[i].subscribe(sourceSubscriber);
    }
    this.subscribers = [...this.subscribers, subscriber];
    return {
      unsubscribe: () => {
        this.subscribers = this.subscribers.filter((e) => e !== subscriber);
      },
    };
  }
}
