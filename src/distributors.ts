import { AbstractSubscribable } from "./abstract.subscribable";
import {
  Predicate,
  Subscriber,
  Subscription,
  UnaryOperator
} from "./interfaces";

export class Distributor<T> extends AbstractSubscribable<T> {
  protected readonly source: AbstractSubscribable<T>;
  protected sourceSubscriber: Subscriber<T> = {
    next: (event: T) => {
      this.subscribers.forEach((subscriber: Subscriber<T>) => {
        subscriber.next(event);
      });
    },
    err: (err: Error) => {
      this.subscribers.forEach((subscriber: Subscriber<T>) => {
        if (subscriber.err) subscriber.err(err);
      });
    },
    final: () => {
      this.subscribers.forEach((subscriber: Subscriber<T>) => {
        if (subscriber.final) subscriber.final();
      });
    },
  };

  constructor(
    source: AbstractSubscribable<any>,
  ) {
    super();
    this.source = source;
  }


  public map<R>(op: UnaryOperator<T,R>): Distributor<R> {
    return new TransformationDistributor(this, op);
  }

  filter(predicate: Predicate<T>) {
    return new FilteredDistributor(this, predicate);
  }

  public subscribe(subscriber: Subscriber<T>): Subscription {
    this.source.subscribe(this.sourceSubscriber);
    return super.subscribe(subscriber);   
  }
}

class TransformationDistributor<T, R> extends Distributor<R> {
  private readonly transform: UnaryOperator<T, R>;
  protected sourceSubscriber: Subscriber<any> = {
    next: (event: T) => {
      const transformedEvent = this.transform(event)
      this.subscribers.forEach((subscriber: Subscriber<R>) => {
        subscriber.next(transformedEvent);
      });
    },
    err: (err: Error) => {
      this.subscribers.forEach((subscriber: Subscriber<R>) => {
        if (subscriber.err) subscriber.err(err);
      });
    },
    final: () => {
      this.subscribers.forEach((subscriber: Subscriber<R>) => {
        if (subscriber.final) subscriber.final();
      });
    },
  };

  constructor(source: AbstractSubscribable<T>, op: UnaryOperator<T,R>) {
    super(source);
    this.transform = op;
  }
}

class FilteredDistributor<T> extends Distributor<T> {
  private readonly predicate: Predicate<T>;
  protected sourceSubscriber: Subscriber<any> = {
    next: (event: T) => {
      if (!this.predicate(event)) {
        return
      }
      this.subscribers.forEach((subscriber: Subscriber<T>) => {
        subscriber.next(event);
      });
    },
    err: (err: Error) => {
      this.subscribers.forEach((subscriber: Subscriber<T>) => {
        if (subscriber.err) subscriber.err(err);
      });
    },
    final: () => {
      this.subscribers.forEach((subscriber: Subscriber<T>) => {
        if (subscriber.final) subscriber.final();
      });
    },
  };

  constructor(source: AbstractSubscribable<T>, predicate: Predicate<T>) {
    super(source);
    this.predicate = predicate;
  }
}