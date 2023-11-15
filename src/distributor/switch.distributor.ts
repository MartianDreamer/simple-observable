import {
  Subscribable,
  Subscriber,
  Subscription,
} from "../interfaces";
import { MultiSourceDistributor } from "./multi.source.distributor";
import {SourceSubscription} from './interfaces';

export class SwitchDistributor<T> extends MultiSourceDistributor<T> {
  private markedCanceledSourceIndex: number = 0;

  public constructor(sources: Subscribable<Subscribable<T>>) {
    super(sources);
  }

  subscribe(subscriber: Subscriber<T>): Subscription {
    this.subscribers = [...this.subscribers, subscriber];
    if (!this.sourceOfSources.subscribed) {
      this.sourceOfSources.source.subscribe({
        ...this.sourceOfSourcesSubscriber,
        next: (event: Subscribable<T>) => {
          const sourceSubscription: SourceSubscription<T> = {
            source: event,
            subscribed: false,
            complete: false,
          };
          this.sourceSubscriptions.push(sourceSubscription);
          sourceSubscription.subscription = sourceSubscription.source.subscribe(
            this.createSourceSubscriber(sourceSubscription),
          );
          sourceSubscription.subscribed = true;
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
      next: (event: T) => {
        // check if this is the first event
        if (!sourceSubscription.alreadyEmitted) {
          sourceSubscription.alreadyEmitted = true;
          const sourceSubscriptionIndex: number =
            this.sourceSubscriptions.indexOf(sourceSubscription);
          // check if this source is late
          const lateSource: boolean = !!this.sourceSubscriptions
            .slice(sourceSubscriptionIndex + 1)
            .find((s: SourceSubscription<T>) => s.alreadyEmitted);
          // if it is not late, cancel all sources before it
          if (!lateSource) {
            for (
              ;
              this.markedCanceledSourceIndex < sourceSubscriptionIndex;
              this.markedCanceledSourceIndex++
            ) {
              const canceledSource: SourceSubscription<T> =
                this.sourceSubscriptions[this.markedCanceledSourceIndex];
              if (canceledSource.subscription) {
                canceledSource.subscription.unsubscribe();
                canceledSource.subscribed = false;
                canceledSource.subscription = undefined;
              }
            }
            // else just return and do nothing
          } else {
            return;
          }
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
      complete: () => {
        sourceSubscription.complete = true;
        if (!this.sourceOfSources.complete) {
          return;
        }
        if (
          !this.sourceSubscriptions[this.sourceSubscriptions.length - 1]
            .complete
        ) {
          return;
        }
        this.subscribers.forEach((subscriber: Subscriber<T>) => {
          if (subscriber.complete) subscriber.complete();
        });
      },
    };
  }
}
