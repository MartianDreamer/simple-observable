import { Distributor } from "./distributor";
import { map, mergeWith } from "./operators";
import { Subject } from "./subject";

const sub: Subject<number> = new Subject();
const sub2: Subject<string> = new Subject();
const dist: Distributor<number | string> = sub.asDistributor().pipe(
  map((e) => Math.floor(e * 100)),
  mergeWith(sub2)
);
dist.subscribe({ next: console.log });
setInterval(() => {
  sub.publish(Math.random());
}, 1000);

setInterval(() => {
  sub2.publish("hello");
}, 4000);
