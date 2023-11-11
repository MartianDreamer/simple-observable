import {SourceSubscription, Subscribable, Subscriber, Subscription} from "../interfaces";
import {AbstractDistributor} from './abstract.distributor';

export class ConcurrentDistributor<T> extends AbstractDistributor<T> {
  protected isStreaming: boolean = false;
  protected readonly sourceSubscriptions: SourceSubscription<T>[];
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
  };

  constructor(...sources: Subscribable<T>[]) {
    super();
    this.sourceSubscriptions = sources.map(e => {
      return {
        source: e,
        subscribed: false
      }
    });
  }

  public subscribe(subscriber: Subscriber<T>): Subscription {
    if (!this.isStreaming) {
      this.sourceSubscriptions.forEach((sourceSubscription) => {
        sourceSubscription.subscription = sourceSubscription.source.subscribe({
          ...this.sourceSubscriber,
          complete: () => {
            sourceSubscription.subscribed = false;
            const someNotComplete: boolean = this.sourceSubscriptions
              .map(e => e.subscribed)
              .reduce((e1, e2) => e1 || e2, false)
            if (!someNotComplete) {
              this.subscribers.forEach((subscriber: Subscriber<T>) => {
                if (subscriber.complete) subscriber.complete();
              })
            }
          }
        });
        sourceSubscription.subscribed = true;
      })
      this.isStreaming = true;
    }
    this.subscribers = [...this.subscribers, subscriber];
    const self = this;
    return {
      unsubscribe() {
        self.subscribers = self.subscribers.filter((e: Subscriber<T>) => e !== subscriber)
      },
    };
  }
}
