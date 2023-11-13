import {
  SourceSubscription,
  Subscribable,
  Subscriber,
  Subscription,
} from "../interfaces";
import { MultiSourceDistributor } from "./multi.source.distributor";

export class ConcurrentDistributor<T> extends MultiSourceDistributor<T> {
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
      this.sourceOfSources.subscription = this.sourceOfSources.source.subscribe(
        {
          ...this.sourceOfSourcesSubscriber,
          next: (event: Subscribable<T>) => {
            // create source subscriptions then push it to the source subscription array
            const sourceSubscription: SourceSubscription<T> = {
              source: event,
              subscribed: true,
              complete: false,
            };
            this.sourceSubscriptions.push(sourceSubscription);
            // subscribe the source
            sourceSubscription.source.subscribe({
              ...this.sourceSubscriber,
              complete: () => {
                // change complete status of the given source
                sourceSubscription.complete = true;
                // check if all the sources in the source subscription array are completed
                const allCurrentSourcesCompleted: boolean = this.areAllSourcesCompleted();
                // if the source of sources and all the source in source subscription array are complete, do the complete function of subscribers if they are defined
                if (
                  this.sourceOfSources.complete &&
                  allCurrentSourcesCompleted
                ) {
                  this.subscribers.forEach((subscriber: Subscriber<T>) => {
                    if (subscriber.complete) subscriber.complete();
                  });
                }
              },
            });
          },
        },
      );
      this.sourceOfSources.subscribed = true;
    }
    // add the subscriber to subscriber array and return a subscription
    return {
      unsubscribe: () => {
        this.subscribers = this.subscribers.filter(
          (e: Subscriber<T>) => e !== subscriber,
        );
      },
    };
  }
}
