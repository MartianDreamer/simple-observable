export interface Subscriber<T> {
  next(event: T): void;

  err?(err: Error): void;

  complete?(): void;
}

export interface Subscribable<T> {
  subscribe(subscriber: Subscriber<T>): Subscription;
}

export interface Subscription {
  unsubscribe(): void;
}

export interface Publisher<T> {
  publish(event: T): void;

  throwError(err: Error): void;

  complete(): void;

  isComplete(): boolean;
}

export interface MappingFunction<T, R> {
  (input: T): R
}

export interface Predicate<T> {
  (input: T): boolean
}

export interface UnaryOperator<T, R> {
  (input: Subscribable<T>): Distributor<R>
}

export interface SourceSubscription<T> {
  source: Subscribable<T>;
  subscription?: Subscription;
  subscribed: boolean;
}

export interface Distributor<T> extends Subscribable<T> {
  pipe(...ops: UnaryOperator<any, any>[]): Distributor<any>;
}