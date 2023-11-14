## A simple publisher subscriber library in typescript

## Summary

### Interfaces

All public interfaces in the library:

* Publisher
* Subscribable
* Subscriber
* Subscription
* Distributor
* UnaryOperator
* Predicate
* MappingFunction
* Interceptor

<strong>Publisher</strong> is a source of events. It has 4 methods which are publish, throwError, complete and
isComplete.

```
interface Publisher<T> {
    publish(event: T): void;        // the method to publish an event
    throwError(err: Error): void;   // the method to forward an error
    complete(): void;               // the method to mark this source as completed
    isComplete(): boolean;          // to check if this publisher is complete
}
```

<strong>Subscribable</strong> is an object which can be subscribed, it provides only subscribe method which returns
a subscription.

```
interface Subscribable<T> {
  subscribe(subscriber: Subscriber<T>): Subscription;
}
```

<strong>Subscriber</strong> is an object which subscribe a subscribable. It has next method to resolve an event, and
probably has err method and complete method.

```
interface Subscriber<T> {
  next(event: T): void;     // resolve events
  err?(err: Error): void;   // resolve errors
  complete?(): void;        // do something when the subscribable is complete
}
```

<strong>Subscription</strong> is an object which is returned after call subscribe method of a subscribable. It has only
one unsubscription method.

```
interface Subscription {
  unsubscribe(): void;
}
```

<strong>Distributor</strong> is a subscribable which can be piped together to manipulate data. It provides subscribe
method and pipe method.

```
interface Distributor<T> {
    subscribe(subscriber: Subscriber<T>): Subscription;
    pipe(...ops: UnaryOperator<any, any>[]): Distributor<any>;
}
```

<strong>UnaryOperator</strong> is a function which has a subscribable input then return a distributor.

```
function UnaryOperator<T,R>(subscribable: Subscribable<T>): Distributor<R>
```

<strong>Predicate</strong> is a function which has an input then returns a boolean.

```
function Predicate<T>(input: T): boolean;
```

<strong>MappingFunction</strong> is a function which has an input then map it to another type output.

```
function MappingFunction<T,R>(input: T): R;
```

<strong>Interceptor</strong> is a function which has an input then return nothing, it just uses the input to do
something without changing the input.

```
function Interceptor<T>(input: T): void;
```

### Event flow

Because a distributor itself is not a publisher it can not publish events. Events that a distributor distributes must be
provided by one or many sources of events. Events flow from sources of events through a pipe of distributors which in
their turn would make some modifications to the events. This implementation allows us to use distributors as a pipeline
to manipulate data before consuming it, therefore more flexibility is added to our library.

```
                                                    Subject
                                                      |||    
                                                      |||  
                                                  Distributor    
                                                 //         \\
                                                //           \\
                                            Subscriber    Subscriber
```

### Implementation

