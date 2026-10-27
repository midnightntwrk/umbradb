/**
 * The page's side of its message network (`./network.ts`; task 16.1): each worker the page starts joins it through a
 * port of its own ({@link NetworkBroker.join}); the broker remembers which worker listens at each address and, for each
 * connection asked for, makes a `MessageChannel` and gives one end to the listener (`accept`) and the other to the
 * worker that asked (`connected`), or answers `refused` when nothing listens there. The connections' messages then go
 * from worker to worker, never through the page.
 */

import type { NetworkMessage } from "./network.js";

export class NetworkBroker {
  readonly #listening = new Map<string, MessagePort>();

  /** A new member's port: give it to the worker (transferred), which passes it to `useNetwork`. */
  join(): MessagePort {
    const channel = new MessageChannel();
    const mine = channel.port1;
    mine.onmessage = (event: MessageEvent<NetworkMessage>) => this.#receive(mine, event.data);
    return channel.port2;
  }

  /** The addresses listened at now. */
  addresses(): string[] {
    return [...this.#listening.keys()];
  }

  #receive(member: MessagePort, message: NetworkMessage): void {
    switch (message.net) {
      case "listen":
        this.#listening.set(message.address, member);
        return;
      case "unlisten":
        if (this.#listening.get(message.address) === member) this.#listening.delete(message.address);
        return;
      case "connect": {
        const listener = this.#listening.get(message.address);
        if (listener === undefined) {
          member.postMessage({ net: "refused", id: message.id } satisfies NetworkMessage);
          return;
        }
        const channel = new MessageChannel();
        listener.postMessage({ net: "accept", address: message.address, port: channel.port1 } satisfies NetworkMessage, [channel.port1]);
        member.postMessage({ net: "connected", id: message.id, port: channel.port2 } satisfies NetworkMessage, [channel.port2]);
        return;
      }
      default:
        return;
    }
  }
}
