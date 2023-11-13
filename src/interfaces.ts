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
  complete: boolean;
  alreadySubscribed?: boolean;
}

export interface Distributor<T> extends Subscribable<T> {
  pipe<B>(op1: UnaryOperator<T, B>): Distributor<B>;
  pipe<B, C>(
    op1: UnaryOperator<T, B>,
    op2: UnaryOperator<B, C>
  ): Distributor<C>;
  pipe<B, C, D>(
    op1: UnaryOperator<T, B>,
    op2: UnaryOperator<B, C>,
    op3: UnaryOperator<C, D>
  ): Distributor<D>;
  pipe<B, C, D, E>(
    op1: UnaryOperator<T, B>,
    op2: UnaryOperator<B, C>,
    op3: UnaryOperator<C, D>,
    op4: UnaryOperator<D, E>
  ): Distributor<E>;
  pipe<B, C, D, E, F>(
    op1: UnaryOperator<T, B>,
    op2: UnaryOperator<B, C>,
    op3: UnaryOperator<C, D>,
    op4: UnaryOperator<D, E>,
    op5: UnaryOperator<E, F>
  ): Distributor<F>;
  pipe<B, C, D, E, F, G>(
    op1: UnaryOperator<T, B>,
    op2: UnaryOperator<B, C>,
    op3: UnaryOperator<C, D>,
    op4: UnaryOperator<D, E>,
    op5: UnaryOperator<E, F>,
    op6: UnaryOperator<F, G>
  ): Distributor<G>;
  pipe<B, C, D, E, F, G, H>(
    op1: UnaryOperator<T, B>,
    op2: UnaryOperator<B, C>,
    op3: UnaryOperator<C, D>,
    op4: UnaryOperator<D, E>,
    op5: UnaryOperator<E, F>,
    op6: UnaryOperator<F, G>,
    op7: UnaryOperator<G, H>
  ): Distributor<H>;
  pipe<B, C, D, E, F, G, H, I>(
    op1: UnaryOperator<T, B>,
    op2: UnaryOperator<B, C>,
    op3: UnaryOperator<C, D>,
    op4: UnaryOperator<D, E>,
    op5: UnaryOperator<E, F>,
    op6: UnaryOperator<F, G>,
    op7: UnaryOperator<G, H>,
    op8: UnaryOperator<H, I>
  ): Distributor<I>;
  pipe<B, C, D, E, F, G, H, I, J>(
    op1: UnaryOperator<T, B>,
    op2: UnaryOperator<B, C>,
    op3: UnaryOperator<C, D>,
    op4: UnaryOperator<D, E>,
    op5: UnaryOperator<E, F>,
    op6: UnaryOperator<F, G>,
    op7: UnaryOperator<G, H>,
    op8: UnaryOperator<H, I>,
    op9: UnaryOperator<I, J>
  ): Distributor<J>;
  pipe(...ops: UnaryOperator<any, any>[]): Distributor<any>;
}