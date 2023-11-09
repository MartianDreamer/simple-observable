import { Distributor } from "./distributor/distributor";
import { concatWith, map } from "./operators";
import { Subject } from "./subject";

const sub: Subject<number> = new Subject();
const sub2: Subject<string> = new Subject();
const dist: Distributor<number | string> = sub.asDistributor().pipe(
  map((e) => Math.floor(e * 100)),
  concatWith(sub2)
);
dist.subscribe({ next: console.log });
const int1 = setInterval(() => {
  sub.publish(Math.random());
}, 1000);

setInterval(() => {
  sub2.publish("hello");
  console.log("hello is emitted");
}, 4000);

setTimeout(() => {
  clearInterval(int1);
  sub.complete();
}, 5000);
