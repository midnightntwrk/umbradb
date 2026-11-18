// Loopback proxy that adds the Blockfrost `project_id` header to every indexer request (ported unchanged from the
// transfer spike, `experiments/00053-transfer-spike/d/indexer-proxy.ts`; decision Q11). The Dust fee wallet alone uses
// the indexer (spec FR-125); the key reaches only this process's memory and the indexer.
//
// Neither the wallet SDK 2.0.0 indexer client nor midnight-js 5.0.0's indexer public-data provider can send a custom
// header:
// - wallet SDK `HttpQueryClient` calls `graphql-http` `createClient({ url, shouldRetry })` with no `headers` option;
//   `WsSubscriptionClient` builds `graphql-ws` on the global `WebSocket` (Node's undici one, which cannot set upgrade
//   headers through the standard constructor) and keeps `webSocketImpl` as a test-only seam.
// - midnight-js `createApolloClient` uses `HttpLink({ fetch: cross-fetch })` with no headers, and its documented
//   Blockfrost route (`networks.preprod(token)`) puts the token in the URL query string, which this work does not do.
// So the clients are pointed at this proxy, which listens on 127.0.0.1 only and forwards HTTP requests and WebSocket
// upgrades to the upstream host with `project_id` added. The key lives only in this process's memory.

import http from 'node:http';
import https from 'node:https';
import type { AddressInfo } from 'node:net';
import type { Duplex } from 'node:stream';

export interface IndexerProxy {
  /** Local GraphQL HTTP URL to give the clients (same path as upstream). */
  readonly httpUrl: string;
  /** Local GraphQL WebSocket URL to give the clients (same path as upstream). */
  readonly wsUrl: string;
  readonly port: number;
  readonly stats: { http: number; httpErrors: number; upgrades: number; upgradeRefused: number; status: Record<number, number> };
  close(): Promise<void>;
}

const HOP_BY_HOP = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
  'host',
  'project_id',
]);

const forwardHeaders = (headers: http.IncomingHttpHeaders, keepUpgrade: boolean): http.OutgoingHttpHeaders => {
  const out: http.OutgoingHttpHeaders = {};
  for (const [name, value] of Object.entries(headers)) {
    if (value === undefined) continue;
    if (HOP_BY_HOP.has(name) && !(keepUpgrade && (name === 'connection' || name === 'upgrade'))) continue;
    out[name] = value;
  }
  return out;
};

const writeRawResponseHead = (socket: Duplex, res: http.IncomingMessage): void => {
  let head = `HTTP/1.1 ${res.statusCode} ${res.statusMessage ?? ''}\r\n`;
  for (let i = 0; i < res.rawHeaders.length; i += 2) head += `${res.rawHeaders[i]}: ${res.rawHeaders[i + 1]}\r\n`;
  socket.write(`${head}\r\n`);
};

export const startIndexerProxy = async (options: {
  upstreamHttp: string;
  upstreamWs: string;
  projectId: string;
  port?: number;
}): Promise<IndexerProxy> => {
  const upstream = new URL(options.upstreamHttp);
  const upstreamWs = new URL(options.upstreamWs);
  if (upstream.protocol !== 'https:' || upstreamWs.protocol !== 'wss:' || upstream.host !== upstreamWs.host) {
    throw new Error('indexer proxy expects https:// and wss:// URLs on the same host');
  }
  const agent = new https.Agent({ keepAlive: true, maxSockets: 16 });
  const stats: IndexerProxy['stats'] = { http: 0, httpErrors: 0, upgrades: 0, upgradeRefused: 0, status: {} };
  const sockets = new Set<Duplex>();

  const server = http.createServer((req, res) => {
    stats.http += 1;
    const upstreamReq = https.request(
      {
        host: upstream.hostname,
        port: upstream.port || 443,
        method: req.method,
        path: req.url,
        agent,
        headers: { ...forwardHeaders(req.headers, false), host: upstream.host, project_id: options.projectId },
      },
      (upstreamRes) => {
        const code = upstreamRes.statusCode ?? 502;
        stats.status[code] = (stats.status[code] ?? 0) + 1;
        res.writeHead(code, upstreamRes.statusMessage, forwardHeaders(upstreamRes.headers, false));
        upstreamRes.pipe(res);
      },
    );
    upstreamReq.on('error', (error) => {
      stats.httpErrors += 1;
      if (!res.headersSent) res.writeHead(502, { 'content-type': 'text/plain' });
      res.end(`indexer proxy upstream error: ${error.message}`);
    });
    req.pipe(upstreamReq);
  });

  server.on('upgrade', (req: http.IncomingMessage, socket: Duplex, head: Buffer) => {
    stats.upgrades += 1;
    sockets.add(socket);
    socket.on('close', () => sockets.delete(socket));
    socket.on('error', () => socket.destroy());
    const upstreamReq = https.request({
      host: upstream.hostname,
      port: upstream.port || 443,
      method: req.method,
      path: req.url,
      headers: { ...forwardHeaders(req.headers, true), host: upstream.host, project_id: options.projectId },
    });
    upstreamReq.on('upgrade', (upstreamRes, upstreamSocket, upstreamHead) => {
      sockets.add(upstreamSocket);
      upstreamSocket.on('close', () => sockets.delete(upstreamSocket));
      writeRawResponseHead(socket, upstreamRes);
      if (upstreamHead.length > 0) socket.write(upstreamHead);
      if (head.length > 0) upstreamSocket.write(head);
      upstreamSocket.on('error', () => socket.destroy());
      socket.on('error', () => upstreamSocket.destroy());
      upstreamSocket.on('close', () => socket.destroy());
      socket.on('close', () => upstreamSocket.destroy());
      upstreamSocket.pipe(socket);
      socket.pipe(upstreamSocket);
    });
    upstreamReq.on('response', (upstreamRes) => {
      // Upgrade refused (for example 403 without a valid project_id): pass the answer through and close.
      stats.upgradeRefused += 1;
      const code = upstreamRes.statusCode ?? 502;
      stats.status[code] = (stats.status[code] ?? 0) + 1;
      writeRawResponseHead(socket, upstreamRes);
      upstreamRes.pipe(socket);
    });
    upstreamReq.on('error', (error) => {
      socket.end(`HTTP/1.1 502 Bad Gateway\r\ncontent-type: text/plain\r\n\r\nindexer proxy upstream error: ${error.message}`);
    });
    upstreamReq.end();
  });

  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(options.port ?? 0, '127.0.0.1', () => resolve());
  });
  const port = (server.address() as AddressInfo).port;
  const path = upstream.pathname.replace(/\/$/, '');
  const wsPath = upstreamWs.pathname.replace(/\/$/, '');
  return {
    httpUrl: `http://127.0.0.1:${port}${path}`,
    wsUrl: `ws://127.0.0.1:${port}${wsPath}`,
    port,
    stats,
    close: () =>
      new Promise<void>((resolve) => {
        for (const socket of sockets) socket.destroy();
        agent.destroy();
        server.close(() => resolve());
        server.closeAllConnections();
      }),
  };
};
