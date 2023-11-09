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

export function mergeWith<T, R> (source: AbstractSubscribable<R>): UnaryOperator<T, T | R> {
  return function (distributor: AbstractSubscribable<T>): Distributor<T | R> {
    return new Distributor<T | R>(distributor, source);
  }
}