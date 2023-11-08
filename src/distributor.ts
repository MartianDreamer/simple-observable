import { AbstractSubscribable } from "./abstract-subscribable";
import {
  Predicate,
  Subscribable,
  Subscriber,
  UnaryOperator,
} from "./interfaces";

export class Distributor<R> extends AbstractSubscribable<R> {
  private readonly source?: Subscribable<any>;
  private transform?: UnaryOperator<any, R>;
  private predicate?: Predicate<any>;

  constructor();
  constructor(source: Subscribable<any>);
  constructor(source: Subscribable<any>, transform: UnaryOperator<any, R>);
  constructor(source: Subscribable<any>, predicate: Predicate<any>);
  constructor(source: Subscribable<any>, transform: UnaryOperator<any, R>, predicate: Predicate<any>);
  constructor(
    source?: Subscribable<any>,
    transform?: UnaryOperator<any, R>,
    predicate?: Predicate<any>
  ) {
    super();
    this.source = source;
    this.transform = transform;
    this.predicate = predicate;
    this.setup();
  }

  private setup() {
    if (!this.source) {
      return;
    }
    const self = this;
    this.source.subscribe({
      next: (event: any) => {
        if (self.predicate) {
          if (!self.predicate(event)) {
            return;
          }
        }
        if (!self.transform) {
          self.subscribers.forEach((subscriber: Subscriber<R>) => {
            subscriber.next(event);
          });
          return;
        }
        const transformedEvent = self.transform(event);
        self.subscribers.forEach((subscriber: Subscriber<R>) => {
          subscriber.next(transformedEvent);
        });
      },
      err: (err: Error) => {
        self.subscribers.forEach((subscriber: Subscriber<R>) => {
          if (subscriber.err) subscriber.err(err);
        });
      },
      final: () => {
        self.subscribers.forEach((subscriber: Subscriber<R>) => {
          if (subscriber.final) subscriber.final();
        });
      },
    });
  }

  public map<K>(op: UnaryOperator<R, K>): Distributor<K> {
    return new Distributor(this, op);
  }
}
