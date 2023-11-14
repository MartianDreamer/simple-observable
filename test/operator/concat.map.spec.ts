import { test } from "@jest/globals";
import { getMockWsDistributor } from "../distributor/mock.util";

describe("test concatMap operator", () => {
  afterAll((done) => {
    done();
  });
  test("concat map http calls", (done) => {
    const resultArray: string[] = [];
    const { distributor, sendMessage, endConnectAfter } =
      getMockWsDistributor();
    distributor.subscribe({
      next(event: string) {
        resultArray.push(event);
      },
      complete: () => {
        expect(resultArray.length).toBe(3);
        done();
      },
    });
    sendMessage("sang");
    sendMessage("truc");
    sendMessage("sang");
    endConnectAfter(1000);
  });
});
