import { Distributor } from "./distributor";
import { Subscriber, Subscription } from "../interfaces";

export class SequentialDistributor<T> extends Distributor<T> {
  public subscribe(subscriber: Subscriber<T>): Subscription {
    const self = this;
    
    return super.subscribe(subscriber);
  }
}
