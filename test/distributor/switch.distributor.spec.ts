import { of, Subject } from "../../src";
import { SwitchDistributor } from "../../src/distributor/switch.distributor";

describe("switch distributor", () => {
  afterAll((done) => {
    done();
  });
  test("when distributor2 run, distributor1 is unsubscribed", () => {
    const sub1 = new Subject<string>();
    const sub2 = new Subject<string>();
    const value: string[] = [];
    const dist3 = new SwitchDistributor(of(sub1, sub2));
    dist3.subscribe({
      next(data: string) {
        value.push(data);
      },
    });
    sub1.publish("s");
    sub1.publish("s");
    sub2.publish("a");
    sub1.publish("s");
    sub2.publish("k");
    expect(value[0]).toBe("s");
    expect(value[1]).toBe("s");
    expect(value[2]).toBe("a");
    expect(value[3]).toBe("k");
    expect(value.length).toBe(4);
  });

  test("wait all source complete before invoke subscribers' complete", () => {
    const sub1 = new Subject<void>();
    const sub2 = new Subject<void>();
    const sub3 = new Subject<void>();
    const dist = new SwitchDistributor(of(sub1, sub2, sub3));
    let testBool = false;
    dist.subscribe({
      next(_event: void) {},
      complete() {
        testBool = true;
      },
    });
    sub3.publish();
    sub3.complete();
    expect(testBool).toBe(true);
  });
});
