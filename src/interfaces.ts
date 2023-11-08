export interface Subscriber<T> {
  next(event: T): void;
  err?(err: Error): void;
  final?(): void;
}

export interface Subscription {
  unsubscribe(): void;
}

export interface Subscribable<T> {
  subscribe(subscriber: Subscriber<T>): Subscription;
}

export interface Publisher<T> {
  publish(event: T): void;
  throwError(err: Error): void
  complete(): void;
}

export interface UnaryOperator<T, R> {
  (input: T): R
}

export interface Predicate<T> {
  (input: T): boolean
}