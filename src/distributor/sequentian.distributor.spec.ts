import { concatWith } from "../operators";
import { Subject } from "../subject/subject";

describe("sequential distributor", () => {
  afterAll((done) => {
    done();
  });
  test("concat 2 subject", () => {
    const sub1 = new Subject<string>();
    const sub2 = new Subject<string>();
    const dist1 = sub1.asDistributor();
    const dist2 = sub2.asDistributor();
    const value: string[] = [];
    const dist3 = dist1.pipe(concatWith(dist2));
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
