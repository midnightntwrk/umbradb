/**
 * The private link's channels: a carrier a host program gives UmbraDB for one connection of the private link, in
 * place of a socket — a `MessagePort`, a TEE's own transport. A host hands a public process each channel a private
 * process opened (`UmbraDBHandle.privateLink.accept`); a private process asks its host for one on each connection.
 * [LM-6; design §5.4]
 *
 * **The host's obligations.** A channel delivers whole messages in order, without loss or duplication, until it ends;
 * messages sent before UmbraDB registers its listener are kept by the carrier for it (UmbraDB registers in the same
 * turn it is given the channel); a carrier without {@link PrivateLinkChannel.bufferedAmount} bounds its own queue.
 * [LM-6]
 */

/** One channel of the private link (see the module comment). [LM-6] */
export interface PrivateLinkChannel {
  /** Sends one message, in order, with no loss and no duplication until the channel ends. */
  send(message: string): void;
  /** Registers a listener for each message the peer sends; returns its disposer. */
  onMessage(listener: (message: string) => void): () => void;
  /** Registers a listener for the carrier's end; returns its disposer. */
  onClose(listener: () => void): () => void;
  /** Ends the channel gracefully. */
  close(): void;
  /** Ends the channel at once; `close()` when the carrier has no forced end. */
  terminate?(): void;
  /** The bytes queued and not yet delivered, when the carrier knows them. */
  bufferedAmount?(): number;
}
