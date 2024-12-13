import {Subscribable, Subscription} from '../interfaces';

export interface DataSource<T> {
  source: Subscribable<T>;
  subscription?: Subscription;
  subscribed: boolean;
  complete: boolean;
  alreadyEmitted?: boolean;
}

export interface DataSourceGenerator<T> {
    (): Subscribable<T>
}