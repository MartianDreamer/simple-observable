import { Distributor } from "./distributor";
import { Subject } from "./subject";

const sub: Subject<string> = new Subject();
const dist1: Distributor<string> = sub.asDistributor();
const dist2: Distributor<number> = dist1.map(data => data.length);
dist1.subscribe({next: console.log})
dist2.subscribe({next: console.log})
setInterval(() => {
  sub.publish(`Hello, it is ${new Date()}`)
}, 1000)