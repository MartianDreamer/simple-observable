import { of, Subject } from "../../src";
import { ConcurrentDistributor } from "../../src/distributor/concurrent.distributor";

describe("concurrent distributor", () => {
  afterAll((done) => {
    done();
  });
  test("distributor1 and distributor2 emits concurrently", () => {
    const sub1 = new Subject<string>();
    const sub2 = new Subject<string>();
    const value: string[] = [];
    const dist3 = new ConcurrentDistributor(of(sub1, sub2));
    dist3.subscribe({
      next(data: string) {
        value.push(data);
      },
    });
    sub1.publish("s");
    sub1.publish("s");
    sub2.publish("t");
    sub1.complete();
    sub2.publish("t");
    expect(value[0]).toBe("s");
    expect(value[1]).toBe("s");
    expect(value[2]).toBe("t");
    expect(value[3]).toBe("t");
    expect(value.length).toBe(4);
  });
});
