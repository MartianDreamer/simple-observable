## A simple publisher subscriber library in typescript

## Summary

### Interfaces

All public interfaces in the library:

* Publisher
* Subscribable
* Subscriber
* Distributor
* Subscription
* Predicate
* MappingFunction
* UnaryOperator
* Interceptor

### Event flow

Because a distributor itself is not a publisher it can not emit events. Events that a distributor distributes must be
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
