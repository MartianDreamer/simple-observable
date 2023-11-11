import {Subscriber, Subscription} from '../interfaces';
import {MultiSourceDistributor} from './multi.source.distributor';

// TODO - implement this class
export class SwitchDistributor<T> extends MultiSourceDistributor<T> {
  protected sourceSubscriber: Subscriber<T> = {
    next(event: T) {
    },
    err(err: Error) {
    },
    complete() {
    }
  };

  subscribe(subscriber: Subscriber<T>): Subscription {
    return {
      unsubscribe() {
      }
    }
  }
}