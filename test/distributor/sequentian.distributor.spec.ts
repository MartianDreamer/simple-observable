import {Subject} from "../../src";
import {SequentialDistributor} from '../../src/distributor/sequential.distributor';

describe("sequential distributor", () => {
  afterAll((done) => {
    done();
  });
  test("concat 2 subject", () => {
    const sub1 = new Subject<string>();
    const sub2 = new Subject<string>();
    const value: string[] = [];
    const dist3 = new SequentialDistributor(sub1, sub2);
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
    expect(value.length).toBe(3);
  });
});
