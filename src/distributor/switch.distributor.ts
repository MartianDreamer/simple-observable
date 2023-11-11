import {ConcurrentDistributor} from './concurrent.distributor';
import {Subscriber} from '../interfaces';

// TODO - implement this class
export class SwitchDistributor<T> extends ConcurrentDistributor<T> {
  protected sourceSubscriber: Subscriber<T> = {
    next(event: T) {
    },
    err(err: Error) {
    },
    complete() {
    }
  };
}