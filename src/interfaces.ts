import { AbstractSubscribable } from "./abstract.subscribable";
import { Distributor } from "./distributor/distributor";

export interface Subscriber<T> {
  next(event: T): void;
  err?(err: Error): void;
  final?(): void;
}

export interface Subscription {
  unsubscribe(): void;
}

export interface Publisher<T> {
  publish(event: T): void;
  throwError(err: Error): void
  complete(): void;
  isComplete(): boolean
}

export interface MappingFunction<T, R> {
  (input: T): R
}

export interface Predicate<T> {
  (input: T): boolean
}

export interface UnaryOperator<T,R> {
  (input: AbstractSubscribable<T>): Distributor<R>
}
