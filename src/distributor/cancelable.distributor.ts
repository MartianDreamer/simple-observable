import { SingleSourceDistributor } from "./single.source.distributor";
import { Subscribable, Subscriber, Subscription } from "../interfaces";

export class CancelableDistributor<T> extends SingleSourceDistributor<T> {
  protected readonly notifierSubscription: Subscription;
  protected notifierSubscriber: Subscriber<any> = {
    next: (_event: any) => {
      if (this.sourceSubscription.subscription) {
        this.sourceSubscription.subscription.unsubscribe();
        this.notifierSubscription.unsubscribe();
      }
    },
  };

  constructor(
    source: Subscribable<T>,
    notifier: Subscribable<any>,
  ) {
    super(source);
    this.notifierSubscription = notifier.subscribe(this.notifierSubscriber);
  }
}
