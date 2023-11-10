import {Subscriber, Subscription} from "../interfaces";
import {Subject} from './subject';

export class BufferedSubject<T> extends Subject<T>{
  private buffer: T[] = [];
  constructor(private size: number) {
    super();
  }

  publish(event: T): void {
    if (this.completed) {
      throw new Error("this subject source completed");
    }
    if (this.buffer.length === this.size) {
      this.buffer = [...this.buffer.slice(1, this.size), event];
    } else {
      this.buffer.push(event);
    }
    for (let subscriber of this.subscribers) {
      subscriber.next(event);
    }
  }

  public subscribe(subscriber: Subscriber<T>): Subscription {
    for (const event of this.buffer) {
      subscriber.next(event);
    }
    return super.subscribe(subscriber);
  }
}
