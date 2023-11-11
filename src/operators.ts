import {Distributor} from "./distributor/distributor";
import {FilteredDistributor} from "./distributor/filtered.distributor";
import {MappingFunction, Predicate, Subscribable, UnaryOperator} from "./interfaces";
import {TransformationDistributor} from "./distributor/transformation.distributor";
import {SequentialDistributor} from "./distributor/sequential.distributor";

export function map<T, R>(fn: MappingFunction<T, R>): UnaryOperator<T, R> {
  return function (distributor: Subscribable<T>): Subscribable<R> {
    return new TransformationDistributor(distributor, fn);
  };
}

export function filter<T>(predicate: Predicate<T>): UnaryOperator<T, T> {
  return function (distributor: Subscribable<T>): Subscribable<T> {
    return new FilteredDistributor(distributor, predicate);
  };
}

export function mergeWith<T, R>(
  source: Subscribable<R>
): UnaryOperator<T, T | R> {
  return function (distributor: Subscribable<T>): Subscribable<T | R> {
    return new Distributor<T | R>(distributor, source);
  };
}

export function concatWith<T, R>(
  source: Subscribable<R>
): UnaryOperator<T, T | R> {
  return function (distributor: Subscribable<T>): Subscribable<T | R> {
    return new SequentialDistributor<T | R>(distributor, source);
  };
}
