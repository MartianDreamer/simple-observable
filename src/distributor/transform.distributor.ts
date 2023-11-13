import { MappingFunction, Subscribable, Subscriber } from "../interfaces";
import { AbstractSingleSourceDistributor } from "./single.source.distributor";

export class TransformDistributor<T, R> extends AbstractSingleSourceDistributor<
  T,
  R
> {
  protected readonly transform: MappingFunction<T, R>;

  constructor(source: Subscribable<T>, op: MappingFunction<T, R>) {
    super(source);
    this.transform = op;
    this.sourceSubscriber.next = (event: T) => {
      const transformedEvent = this.transform(event);
      this.subscribers.forEach((subscriber: Subscriber<R>) => {
        subscriber.next(transformedEvent);
      });
    };
  }
}
