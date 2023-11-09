import { Distributor } from "./distributor";
import { map, merge } from "./operators";
import { Subject } from "./subject";

const sub: Subject<number> = new Subject();
const sub2: Subject<string> = new Subject();
const dist: Distributor<number> = sub.asDistributor().pipe(
  map(e => Math.floor(e*100)),
  merge(sub2),
);
dist.subscribe({ next: (e) => console.log(e - 1)  });
setInterval(() => {
  sub.publish(Math.random());
}, 1000);

setInterval(() => {
  sub2.publish("hello")
}, 4000)
