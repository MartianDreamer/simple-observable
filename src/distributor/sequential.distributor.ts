import {
  SourceSubscription,
  Subscribable,
  Subscriber,
  Subscription,
} from "../interfaces";
import { MultiSourceDistributor } from "./multi.source.distributor";

export class SequentialDistributor<T> extends MultiSourceDistributor<T> {
  protected sourceSubscriber: Subscriber<T> = {
    next: (event: T) => {
      // everytime a source emit an event, distribute the event to all subscribers
      this.subscribers.forEach((subscriber: Subscriber<T>) => {
        subscriber.next(event);
      });
    },
    err: (err: Error) => {
      // everytime a source emit an error, distribute the event to all subscribers
      this.subscribers.forEach((subscriber: Subscriber<T>) => {
        if (subscriber.err) subscriber.err(err);
      });
    },
  };

  constructor(sources: Subscribable<Subscribable<T>>) {
    super(sources);
  }

  public subscribe(subscriber: Subscriber<T>): Subscription {
    this.subscribers = [...this.subscribers, subscriber];
    if (!this.sourceOfSources.subscribed) {
      const sourceOfSourcesSubscriber: Subscriber<Subscribable<T>> = {
        ...this.sourceOfSourcesSubscriber,
        next: (event: Subscribable<T>) => {
          const sourceSubscription: SourceSubscription<T> = {
            source: event,
            subscribed: true,
            complete: false,
          };
          const allSourceAreCompleted: boolean = this.areAllSourcesCompleted();
          this.sourceSubscriptions.push(sourceSubscription);
          if (allSourceAreCompleted) {
            sourceSubscription.source.subscribe(
              this.createSourceSubscriber(sourceSubscription),
            );
          }
        },
      }
      this.sourceOfSources.source.subscribe(sourceOfSourcesSubscriber);
      this.sourceOfSources.subscribed = true;
    }
    return {
      unsubscribe: () => {
        this.subscribers = this.subscribers.filter((e) => e !== subscriber);
      },
    };
  }

  private createSourceSubscriber(
    sourceSubscription: SourceSubscription<T>,
  ): Subscriber<T> {
    return {
      ...this.sourceSubscriber,
      complete: () => {
        sourceSubscription.complete = true;
        const allSourceAreCompleted = this.areAllSourcesCompleted();
        if (allSourceAreCompleted && this.sourceOfSources.complete) {
          this.subscribers.forEach((subscriber: Subscriber<T>) => {
            if (subscriber.complete) subscriber.complete();
          });
        } else if (!allSourceAreCompleted) {
          const nextSourceIndex: number =
            this.sourceSubscriptions.indexOf(sourceSubscription) + 1;
          if (nextSourceIndex < this.sourceSubscriptions.length) {
            const nextSource: SourceSubscription<T> =
              this.sourceSubscriptions[nextSourceIndex];
            nextSource.source.subscribe(
              this.createSourceSubscriber(nextSource),
            );
          }
        }
      },
    };
  }
}
