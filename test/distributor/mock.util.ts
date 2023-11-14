import { BufferedSubject, Distributor, Subject } from "../../src";

export function sendMockHttpRequest(input: string): Distributor<string> {
  const sub: BufferedSubject<string> = new BufferedSubject<string>(1);
  setTimeout(() => {
    sub.publish(`response for message "${input}"`);
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
