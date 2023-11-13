import {SourceSubscription, Subscriber, Subscription} from '../interfaces';
import {MultiSourceDistributor} from './multi.source.distributor';

// TODO - implement this class
export class SwitchDistributor<T> extends MultiSourceDistributor<T> {

  private createSourceSubscriber(sourceSubscription: SourceSubscription<T>): Subscriber<T> {
    return {
      next: (event: T) => {
      },
      err: (err: Error) => {
      },
      complete: () => {
      }
    }
  }

  subscribe(subscriber: Subscriber<T>): Subscription {
    return {
      unsubscribe() {
      }
    }
  }
}