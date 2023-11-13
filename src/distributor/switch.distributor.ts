import {SourceSubscription, Subscriber, Subscription} from '../interfaces';
import {MultiSourceDistributor} from './multi.source.distributor'; // TODO - implement this class

// TODO - implement this class
export class SwitchDistributor<T> extends MultiSourceDistributor<T> {
  private markedCanceledSourceIndex: number = 0;
  subscribe(subscriber: Subscriber<T>): Subscription {
    return {
      unsubscribe() {},
    };
  }

  private createSourceSubscriber(
    sourceSubscription: SourceSubscription<T>,
  ): Subscriber<T> {
    return {
      next: (event: T) => {
        if (!!sourceSubscription.alreadySubscribed) {
          const sourceSubscriptionIndex: number =
            this.sourceSubscriptions.indexOf(sourceSubscription);
          const latePublication: boolean = !!this.sourceSubscriptions
            .slice(sourceSubscriptionIndex)
            .find(
              (sourceSubscription: SourceSubscription<T>) =>
                sourceSubscription.subscribed,
            );
          if (!latePublication) {
            for (this.markedCanceledSourceIndex; this.markedCanceledSourceIndex < sourceSubscriptionIndex; this.markedCanceledSourceIndex++) {
              const curSource: SourceSubscription<T> =
                this.sourceSubscriptions[this.markedCanceledSourceIndex];
              if (curSource.subscription) {
                curSource.subscription.unsubscribe();
                curSource.subscription = undefined;
                curSource.subscribed = false;
              }
            }
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
