import {MappingFunction, Subscribable, Subscriber} from "../interfaces";
import {AbstractSingleSourceDistributor} from './single.source.distributor';

export class TransformDistributor<T, R> extends AbstractSingleSourceDistributor<T, R> {
  protected readonly transform: MappingFunction<T, R>;
  protected sourceSubscriber: Subscriber<T> = {
    ...super.sourceSubscriber,
    next: (event: T) => {
      const transformedEvent = this.transform(event);
      this.subscribers.forEach((subscriber: Subscriber<R>) => {
        subscriber.next(transformedEvent);
      });
    },
  };

  constructor(source: Subscribable<T>, op: MappingFunction<T, R>) {
    super(source);
    this.transform = op;
  }

}
