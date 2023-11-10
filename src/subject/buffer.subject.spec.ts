import { BufferedSubject } from "./buffered.subject";

describe("bufferd subject", () => {
  test("buffered subject buffer previous events", () => {
    const sub: BufferedSubject<number> = new BufferedSubject(3);
    const value: number[] = [];
    sub.publish(1);
    sub.publish(2);
    sub.publish(3);
    sub.publish(4);
    sub.publish(1);
    sub.subscribe({
      next(event: number) {
        value.push(event);
      },
    });
    expect(value.toString()).toBe([3, 4, 1].toString());
  });

  afterAll((done) => {
    done();
  });
});
