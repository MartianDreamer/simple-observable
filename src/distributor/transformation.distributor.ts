import { AbstractSubscribable } from "../abstract.subscribable";
import { Distributor } from "./distributor";
import { MappingFunction, Subscriber } from "../interfaces";

export class TransformationDistributor<T, R> extends Distributor<R> {
  private readonly transform: MappingFunction<T, R>;
  protected sourceSubscriber: Subscriber<any> = {
    next: (event: T) => {
      const transformedEvent = this.transform(event);
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

  constructor(source: AbstractSubscribable<T>, op: MappingFunction<T, R>);
  constructor(source: AbstractSubscribable<any>, op: MappingFunction<T, R>) {
    super(source);
    this.transform = op;
  }
}
