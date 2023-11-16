import { test } from "@jest/globals";
import {
  getMockWsDistributor,
  MockResponse,
  sendMockHttpRequest,
} from "../mock.util";
import { concatMap } from "../../src";

describe("test concatMap operator", () => {
  afterAll((done) => {
    done();
  });
  test("concat map http calls", (done) => {
    const resultArray: MockResponse<string>[] = [];
    const { distributor, sendMessage, endConnectAfter } =
      getMockWsDistributor();
    distributor
      .pipe(
        concatMap((data: string) => {
          return sendMockHttpRequest(data);
        }),
      )
      .subscribe({
        next(event: MockResponse<string>) {
          resultArray.push(event);
        },
        complete: () => {
          expect(resultArray.length).toBe(3);
          expect(resultArray[0].response).toBe("sang");
          expect(resultArray[1].response).toBe("truc");
          expect(resultArray[2].response).toBe("sang");
          done();
        },
      });
    sendMessage("sang");
    sendMessage("truc");
    sendMessage("sang");
    endConnectAfter(1000);
  });
});
