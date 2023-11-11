import {Predicate, Subscribable, Subscriber} from '../interfaces';
import {SingleSourceDistributor} from './single.source.distributor';

export class FilteredDistributor<T> extends SingleSourceDistributor<T, T> {
  protected readonly sourceSubscriber: Subscriber<T> = {
    next: (event: T) => {
      if (this.predicate(event)) {
        this.subscribers.forEach((subscriber: Subscriber<T>) => {
          subscriber.next(event);
        })
      }
    },
    err: (err: Error) => {
      this.subscribers.forEach((subscriber: Subscriber<T>) => {
        if (subscriber.err) subscriber.err(err);
      });
    },
    complete: () => {
      this.subscribers.forEach((subscriber: Subscriber<T>) => {
        if (subscriber.complete) subscriber.complete();
      });
    }
  }

  constructor(source: Subscribable<T>, private predicate: Predicate<T>) {
    super(source);
  }
}