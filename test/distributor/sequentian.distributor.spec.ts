import { of, Subject } from "../../src";
import { SequentialDistributor } from "../../src/distributor/sequential.distributor";

describe("sequential distributor", () => {
  afterAll((done) => {
    done();
  });
  test("distributor2 wait distributor1 complete before emitting", () => {
    const sub1 = new Subject<string>();
    const sub2 = new Subject<string>();
    const value: string[] = [];
    const dist3 = new SequentialDistributor(of(sub1, sub2));
    dist3.subscribe({
      next(data: string) {
        value.push(data);
      },
    });
    sub1.publish("s");
    sub1.publish("s");
    sub2.publish("a");
    sub1.complete();
    sub2.publish("t");
    expect(value[0]).toBe("s");
    expect(value[1]).toBe("s");
    expect(value[2]).toBe("t");
    expect(value.length).toBe(3);
  });

  test("wait all source complete before invoke subscribers' complete", () => {
    const sub1 = new Subject<void>();
    const sub2 = new Subject<void>();
    const sub3 = new Subject<void>();
    const dist = new SequentialDistributor(of(sub1, sub2, sub3));
    let testBool = false;
    dist.subscribe({
      next(_event: void) {},
      complete() {
        testBool = true;
      },
    });
    sub1.complete();
    sub3.complete();
    expect(testBool).toBe(false);
    sub2.complete();
    expect(testBool).toBe(true);
  });
});
