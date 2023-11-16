import { BufferedSubject, Distributor, Subject } from "../src";

export interface MockResponse<T> {
  response: T;
}

export function sendMockHttpRequest<T>(input: T): Distributor<MockResponse<T>> {
  const sub: BufferedSubject<MockResponse<T>> = new BufferedSubject<MockResponse<T>>(1);
  setTimeout(() => {
    sub.publish({
      response: input
    });
    sub.complete();
  }, 1000);
  return sub.asDistributor();
}

export function getMockWsDistributor(): {
  distributor: Distributor<string>;
  sendMessage(input: string): void;
  endConnectAfter(millisecond: number): void;
} {
  const mockWsSub: Subject<string> = new Subject();
  return {
    distributor: mockWsSub.asDistributor(),
    sendMessage(input: string) {
      setTimeout(() => {
        mockWsSub.publish(input);
      }, 200);
    },
    endConnectAfter(millisecond: number) {
      setTimeout(() => {
        mockWsSub.complete();
      }, millisecond);
    },
  };
}
