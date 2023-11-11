import {AbstractDistributor} from './abstract.distributor';
import {SourceSubscription, Subscribable} from '../interfaces';

export abstract class MultiSourceDistributor<T> extends AbstractDistributor<T> {
  protected isStreaming: boolean = false;
  protected readonly sourceSubscriptions: SourceSubscription<T>[];

  protected constructor(sources: Subscribable<T>[]) {
    super();
    this.sourceSubscriptions = sources.map(e => {
      return {
        source: e,
        subscribed: false
      }
    });
  }
}