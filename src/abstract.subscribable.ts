import { Subscriber, Subscription } from "./interfaces";

export abstract class AbstractSubscribable<T> {
  protected subscribers: Subscriber<T>[] = [];

  public subscribe(subscriber: Subscriber<T>): Subscription {
    this.subscribers = [...this.subscribers, subscriber];
    const self = this;
    return {
      unsubscribe() {
        self.subscribers = self.subscribers.filter((e: Subscriber<T>) => e !== subscriber)
      },
    };
  }
}