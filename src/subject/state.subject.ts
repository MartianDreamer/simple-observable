import {Subject} from './subject';
import {Subscriber, Subscription} from '../interfaces';

export class StateSubject<T> extends Subject<T> {

  constructor(private state: T) {
    super();
  }

  publish(event: T) {
    this.state = event;
    super.publish(event);
  }

  subscribe(subscriber: Subscriber<T>): Subscription {
    subscriber.next(this.state);
    return super.subscribe(subscriber);
  }
}