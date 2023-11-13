import {SourceSubscription, Subscribable, Subscriber, Subscription} from '../interfaces';
import {AbstractDistributor} from './abstract.distributor';

export abstract class AbstractSingleSourceDistributor<T, R> extends AbstractDistributor<R> {
  protected sourceSubscription: SourceSubscription<T>;
  protected sourceSubscriber: Subscriber<T> = {
    next: (_event: T) => {
      // this method must be overridden
    },
    err: (err: Error) => {
      this.subscribers.forEach((subscriber: Subscriber<R>) => {
        if (subscriber.err) subscriber.err(err);
      });
    },
    complete: () => {
      this.sourceSubscription.complete = true;
      this.subscribers.forEach((subscriber: Subscriber<R>) => {
        if (subscriber.complete) subscriber.complete();
      });
    },
  }

  protected constructor(source: Subscribable<T>) {
    super();
    this.sourceSubscription = {
      source,
      subscribed: false,
      complete: false
    }
  }

  subscribe(subscriber: Subscriber<R>): Subscription {
    if (!this.sourceSubscription.subscribed) {
      this.sourceSubscription.subscription = this.sourceSubscription.source.subscribe(this.sourceSubscriber);
      this.sourceSubscription.subscribed = true;
    }
    this.subscribers = [...this.subscribers, subscriber];
    return {
      unsubscribe: () => {
        this.subscribers = this.subscribers.filter(e => e !== subscriber);
      }
    }
  }
}

export class SingleSourceDistributor<T> extends AbstractSingleSourceDistributor<T, T> {

  protected readonly sourceSubscriber: Subscriber<T> = {
    ...super.sourceSubscriber,
    next: (event: T) => {
      this.subscribers.forEach((subscriber: Subscriber<T>) => {
        subscriber.next(event);
      })
    },
  }

  constructor(source: Subscribable<T>) {
    super(source);
  }
}