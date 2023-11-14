import {Subscribable, Subscription} from '../interfaces';

export interface SourceSubscription<T> {
  source: Subscribable<T>;
  subscription?: Subscription;
  subscribed: boolean;
  complete: boolean;
  alreadyEmitted?: boolean;
}
