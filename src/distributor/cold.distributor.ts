import { Subscribable, Subscriber, Subscription } from "../interfaces";
import { AbstractDistributor } from "./abstract.distributor";
import { DataSourceGenerator } from "./interfaces";

export class ColdDistributor<T> extends AbstractDistributor<T> {

    public constructor(private readonly generator: DataSourceGenerator<T>) {
        super()
    }

    public subscribe(subscriber: Subscriber<T>): Subscription {
        let dataSource: Subscribable<T> = this.generator()
        return dataSource.subscribe(subscriber)
    }
}