import {ConcurrentDistributor} from "./distributor/concurrent.distributor";
import {FilteredDistributor} from "./distributor/filtered.distributor";
import {Distributor, MappingFunction, Predicate, Subscribable, UnaryOperator} from "./interfaces";
import {TransformDistributor} from "./distributor/transform.distributor";
import {SequentialDistributor} from "./distributor/sequential.distributor";

export function map<T, R>(fn: MappingFunction<T, R>): UnaryOperator<T, R> {
  return function (distributor: Subscribable<T>): Distributor<R> {
    return new TransformDistributor(distributor, fn);
  };
}

export function filter<T>(predicate: Predicate<T>): UnaryOperator<T, T> {
  return function (distributor: Subscribable<T>): Distributor<T> {
    return new FilteredDistributor(distributor, predicate);
  };
}

export function mergeWith<T, R>(
  source: Subscribable<R>
): UnaryOperator<T, T | R> {
  return function (distributor: Subscribable<T>): Distributor<T | R> {
    return new ConcurrentDistributor<T | R>(distributor, source);
  };
}

export function concatWith<T, R>(
  source: Subscribable<R>
): UnaryOperator<T, T | R> {
  return function (distributor: Subscribable<T>): Distributor<T | R> {
    return new SequentialDistributor<T | R>(distributor, source);
  };
}
