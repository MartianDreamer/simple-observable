import { AbstractSubscribable } from "./abstract.subscribable";
import { Distributor } from "./distributor";
import { FilteredDistributor } from "./filtered.distributor";
import { MappingFunction, Predicate, UnaryOperator } from "./interfaces";
import { TransformationDistributor } from "./transformation.distributor";

export function map<T, R>(fn: MappingFunction<T, R>): UnaryOperator<T, R> {
  return function (distributor: AbstractSubscribable<T>): Distributor<R> {
    return new TransformationDistributor(distributor, fn);
  };
}

export function filter<T>(predicate: Predicate<T>): UnaryOperator<T, T> {
  return function (distributor: AbstractSubscribable<T>): Distributor<T> {
    return new FilteredDistributor(distributor, predicate);
  }
}

export function merge<A, B>(sub: AbstractSubscribable<B>): UnaryOperator<A, A | B>;
export function merge<A, B, C>(sub1: AbstractSubscribable<B>, sub2: AbstractSubscribable<C>): UnaryOperator<A, A | B | C>;
export function merge<A>(...sources: AbstractSubscribable<any>[]): UnaryOperator<A, any> {
  return function (distributor: AbstractSubscribable<A>): Distributor<any> {
    return new Distributor(distributor, ...sources);
  }
}