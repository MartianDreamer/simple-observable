import { Subscribable, Subscriber, Subscription } from "./interfaces";

export abstract class AbstractSubscribable<T> implements Subscribable<T> {
  protected readonly subscribers: Subscriber<T>[] = [];

  subscribe(subscriber: Subscriber<T>): Subscription {
    this.subscribers.push(subscriber);
    const self = this;
    return {
      unsubscribe() {
        const index = self.subscribers.indexOf(subscriber);
        self.subscribers.splice(index, 1);
      },
    };
  }
}