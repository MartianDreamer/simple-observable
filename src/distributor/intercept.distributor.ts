import { AbstractSingleSourceDistributor } from "./single.source.distributor";
import { Interceptor, Subscribable, Subscriber } from "../interfaces";

export class InterceptDistributor<T> extends AbstractSingleSourceDistributor<
  T,
  T
> {
  public constructor(source: Subscribable<T>, intercept: Interceptor<T>) {
    super(source);
    this.sourceSubscriber.next = (event) => {
      const eventCopy: T = Object.assign({}, event);
      intercept(eventCopy);
      this.subscribers.forEach((subscriber: Subscriber<T>) =>
        subscriber.next(event),
      );
    };
  }
}