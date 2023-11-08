import { Distributor } from "./distributors";
import { Subject } from "./subject";

const sub: Subject<number> = new Subject();
const dist: Distributor<string> = sub
  .asDistributor()
  .map((e) => e % 10)
  .filter((e) => e % 2 !== 0)
  .map((e) => `${e} is not even`);
dist.subscribe({ next: console.log });
setInterval(() => {
  sub.publish(new Date().getTime());
}, 1000);
