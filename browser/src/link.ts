/**
 * The page's private link between the core worker and a private worker: one `MessageChannel` per connection, which the
 * page makes when a private process asks for a channel (its `privateSide: { connect }`), handing one end to the core
 * worker (`publicSide: { channels: true }`, the core's `privateLink.accept`) and the other to the private worker. The
 * link's messages then go from worker to worker, never through the page.
 *
 * Each end is the port as `messagePortChannel` adapts it, plus the page's own end of the channel ({@link DemoLink.end}):
 * the page may drop a link (`window.umbradb.dropLink`), and then tells both workers, each of which closes its port and
 * tells UmbraDB the carrier ended — as a socket's end is told, which a browser `MessagePort` may never tell by itself.
 * The private process then connects again over a new channel, with its transport's back-off.
 */

import { messagePortChannel, type PrivateLinkChannel } from "../../src/library/channels.js";

/** One worker's end of one link channel. */
export interface DemoLink {
  /** What UmbraDB is given: the port, as `messagePortChannel` adapts it, whose end the page can tell. */
  readonly channel: PrivateLinkChannel;
  /** The page dropped the link: the port is closed and UmbraDB told the carrier ended, once. */
  end(): void;
}

/** The end of a link channel on `port` (see the module comment). */
export function demoLink(port: MessagePort): DemoLink {
  const inner = messagePortChannel(port);
  const listeners = new Set<() => void>();
  let ended = false;
  const tell = (): void => {
    if (ended) return;
    ended = true;
    for (const listener of [...listeners]) listener();
  };
  // A browser that tells a port's close tells it too.
  inner.onClose(tell);
  const channel: PrivateLinkChannel = Object.freeze({
    send: (message: string) => inner.send(message),
    onMessage: (listener: (message: string) => void) => inner.onMessage(listener),
    onClose(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    close() {
      // UmbraDB's own close: the channel has ended for it, nothing more to tell.
      ended = true;
      inner.close();
    },
  });
  return {
    channel,
    end() {
      inner.close();
      tell();
    },
  };
}
