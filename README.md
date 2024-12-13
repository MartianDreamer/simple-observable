# A simple publisher subscriber library in typescript

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

<b>Publisher</b> is a source of events. It has 4 methods which are publish, throwError, complete and
isComplete.

```
interface Publisher<T> {
    publish(event: T): void;        // the method to publish an event
    throwError(err: Error): void;   // the method to forward an error
    complete(): void;               // the method to mark this source as completed
    isComplete(): boolean;          // to check if this publisher is complete
}
```

<b>Subscribable</b> is an object which can be subscribed, it provides only subscribe method which returns
a subscription.

```
interface Subscribable<T> {
  subscribe(subscriber: Subscriber<T>): Subscription;
}
```

<b>Subscriber</b> is an object which subscribe a subscribable. It has next method to resolve an event, and
probably has err method and complete method.

```
interface Subscriber<T> {
  next(event: T): void;     // resolve events
  err?(err: Error): void;   // resolve errors
  complete?(): void;        // do something when the subscribable is complete
}
```

<b>Subscription</b> is an object which is returned after call subscribe method of a subscribable. It has only
one unsubscription method.

```
interface Subscription {
  unsubscribe(): void;
}
```

<b>Distributor</b> is a subscribable which can be piped together to manipulate data. It provides subscribe
method and pipe method.

```
interface Distributor<T> {
    subscribe(subscriber: Subscriber<T>): Subscription;
    pipe(...ops: UnaryOperator<any, any>[]): Distributor<any>;
}
```

<b>UnaryOperator</b> is a function which has a subscribable input then return a distributor.

```
function UnaryOperator<T,R>(subscribable: Subscribable<T>): Distributor<R>
```

<b>Predicate</b> is a function which has an input then returns a boolean.

```
function Predicate<T>(input: T): boolean;
```

<b>MappingFunction</b> is a function which has an input then map it to another type output.

```
function MappingFunction<T,R>(input: T): R;
```

<b>Interceptor</b> is a function which has an input then return nothing, it just uses the input to do
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
                                                      ||    
                                                      ||  
                                                  Distributor    
                                                //           \\
                                               //             \\
                                    Distributor                 Distributor
                                  //           \\             //           \\
                                 //             \\           //             \\
                             Subscriber     Subscriber   Subscriber      Subscriber
```

## How to

### Subjects

#### Subject

<b>Subject</b> is a subscribable publisher. It has all publisher's method and subscribable's methods. It also
provides an asDistributor method which will convert the subject to a distributor, so it would have the pipeline-ability
of Distributors.

When a subscriber subscribe a subject, the subject will check if it completed. If it completes, it will call the
complete(if the method is defined) method of the subscriber. Otherwise, it will call the subscriber's next method when
an event is published.

With this type of subject, the subscriber will only be notified about an event if it subscribes the subject before that
event is published.

#### BufferedSubject

<b>BufferedSubject</b> is a subject which buffers a certain number of events that were published before. To
create a BufferedSubject, a buffer size n is required. When a new subscriber subscribes a
BufferedSubject, the next method will be called for all the events in the buffer.

#### StateSubject

<b>StateSubject</b> is a subject that has a state. To create a StateSubject, a default state is required. When
a new subscriber subscribes a StateSubject, the next method will be called for the current state of the StateSubject.

#### Methods of subject

##### subscribe(subscriber: Subscriber\<T\>): void

<b>subscribe</b> is used to register a subscriber to the subject.

```
    const subject: Subject<number> = new Subject(); // create an subject
    subject.subscribe({
        next(event: T) {
            console.log(event); // just log events
        }
    }); // register a subscriber with subject
```

##### asDistributor(): Distributor\<T\>

<b>asDistributor</b> is used to convert a subject to a distributor

```
    const subject: Subject<number> = new Subject(); // create an subject
    const dist: Distributor<number> = subject.asDistributor(); // convert subject to distributor
```

##### publish(event: T): void

<b>publish</b> is used to publish a new event

##### throwError(err: Error): void

<b>throwError</b> is used to propagate errors to subscribers

##### complete(): void

<b>complete</b> is called to complete the subject. It would invoke subscribers' complete methods.

```
    const subject: Subject<number> = new Subject(); // create an subject
    try {
        while(condition) {
            const someEvent: string = generateEvent();
            subject.publish(someEvent);             // publish events
            condition = recheckCondition();
        }
    } catch(err) {
        subject.throwError(err);                    // propagate error to subscribers
    } finally {
        subject.complete();                         // complete this subject
    }
```
## What to do next?

### MultiSourceDistributor refactor

Currently, multi source distributors is so difficult to understand because of the usage of source of data sources. Refactor it to a chain or a list of data sources to make it easier to understand.