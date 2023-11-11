import {Distributor} from "./distributor";
import {Predicate, Subscribable, Subscriber} from "../interfaces";

export class FilteredDistributor<T> extends Distributor<T> {
  private readonly predicate: Predicate<T>;
  protected sourceSubscriber: Subscriber<T> = {
    ...super.sourceSubscriber,
    next: (event: T) => {
      if (!this.predicate(event)) {
        return;
      }
      this.subscribers.forEach((subscriber: Subscriber<T>) => {
        subscriber.next(event);
      });
    }
  };

  constructor(source: Subscribable<T>, predicate: Predicate<T>) {
    super(source);
    this.predicate = predicate;
  }
}