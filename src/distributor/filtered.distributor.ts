import {Distributor} from "./distributor";
import {Predicate, Subscribable, Subscriber} from "../interfaces";

export class FilteredDistributor<T> extends Distributor<T> {
  private readonly predicate: Predicate<T>;
  protected sourceSubscriber: Subscriber<any> = {
    next: (event: T) => {
      if (!this.predicate(event)) {
        return;
      }
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
      this.subscribers.forEach((subscriber: Subscriber<T>) => {
        if (subscriber.final) subscriber.final();
      });
    },
  };

  constructor(source: Subscribable<T>, predicate: Predicate<T>) {
    super(source);
    this.predicate = predicate;
  }
}