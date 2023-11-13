import { AbstractDistributor } from "./abstract.distributor";
import { SourceSubscription, Subscribable, Subscriber } from "../interfaces";

export abstract class MultiSourceDistributor<T> extends AbstractDistributor<T> {
  protected readonly sourceSubscriptions: SourceSubscription<T>[] = [];
  protected readonly sourceOfSources: SourceSubscription<Subscribable<T>>;
  protected readonly sourceOfSourcesSubscriber: Subscriber<Subscribable<T>> = {
    next: (_event: Subscribable<T>) => {
      // this method need to be overridden
    },
    err: (err: Error) => {
      // everytime the source of source emit an error, distribute the event to all subscribers
      this.subscribers.forEach((subscriber: Subscriber<T>) => {
        if (subscriber.err) subscriber.err(err);
      });
    },
    complete: () => {
      this.sourceOfSources.complete = true;
    },
  };

  protected constructor(sources: Subscribable<Subscribable<T>>) {
    super();
    this.sourceOfSources = {
      source: sources,
      subscribed: false,
      complete: false,
    };
  }

  protected areAllSourcesCompleted(): boolean {
    return this.sourceSubscriptions
      .map(
        (sourceSubscription: SourceSubscription<T>) =>
          sourceSubscription.complete,
      )
      .reduce((s1: boolean, s2: boolean) => s1 && s2, true);
  }
}
