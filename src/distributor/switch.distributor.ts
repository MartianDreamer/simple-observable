import {Distributor} from './distributor';
import {Subscriber} from '../interfaces';

export class SwitchDistributor<T> extends Distributor<T> {
  protected sourceSubscriber: Subscriber<T> = {
    next(event: T) {
    },
    err(err: Error) {
    },
    final() {
    }
  };
}