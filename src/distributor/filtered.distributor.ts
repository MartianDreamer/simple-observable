import { Predicate, Subscribable, Subscriber } from "../interfaces";
import { AbstractSingleSourceDistributor } from "./single.source.distributor";

export class FilteredDistributor<T> extends AbstractSingleSourceDistributor<
  T,
  T
> {
  constructor(
    source: Subscribable<T>,
    private predicate: Predicate<T>,
  ) {
    super(source);
    this.sourceSubscriber.next = (event: T) => {
      if (this.predicate(event)) {
        this.subscribers.forEach((subscriber: Subscriber<T>) => {
          subscriber.next(event);
        });
      }
    };
  }
}
