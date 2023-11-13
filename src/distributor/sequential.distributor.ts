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

  public constructor(sources: Subscribable<Subscribable<T>>) {
    super(sources);
  }

  public subscribe(subscriber: Subscriber<T>): Subscription {
    this.subscribers = [...this.subscribers, subscriber];
    if (!this.sourceOfSources.subscribed) {
      this.sourceOfSources.source.subscribe({
        ...this.sourceOfSourcesSubscriber,
        next: (event: Subscribable<T>) => {
          const sourceSubscription: SourceSubscription<T> = {
            source: event,
            subscribed: true,
            complete: false,
          };
          // check if all sources in sources subscription array completed then push new source into the array
          // if all sources completed, subscribe the new source
          const allSourceAreCompleted: boolean = this.areAllSourcesCompleted();
          this.sourceSubscriptions.push(sourceSubscription);
          if (allSourceAreCompleted) {
            sourceSubscription.subscription =
              sourceSubscription.source.subscribe(
                this.createSourceSubscriber(sourceSubscription),
              );
            sourceSubscription.subscribed = true;
          }
        },
      });
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
        // check if all the sources in sources array completed, if yes and source of sources completed as well, run all subscriber complete methods.
        const allSourceAreCompleted = this.areAllSourcesCompleted();
        if (allSourceAreCompleted && this.sourceOfSources.complete) {
          this.subscribers.forEach((subscriber: Subscriber<T>) => {
            if (subscriber.complete) subscriber.complete();
          });
          // else if some sources has not completed, subscribe the next available source, if there is no available source, do nothing
          // the next time source of sources emits a new source, all the sources have completed then the new source would be subscribed
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
