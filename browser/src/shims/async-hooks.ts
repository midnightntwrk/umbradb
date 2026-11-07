/**
 * `node:async_hooks` in the browser build. A browser has no asynchronous context (TC39's `AsyncContext` is not
 * shipped). So `src/db/pglite.ts`'s guard against a nested call (a body that calls `db.read` or `db.transaction` on its
 * own database instead of using its handle) cannot tell such a call from any other. [Q73; design §9.2]
 *
 * Here a store is never seen (`getStore()` is undefined) and a bound function runs as it is. Every call is then an
 * ordinary caller's, so the guard is off in the browser: a nested call waits in the queue for ever instead of being
 * refused with `nested-call`. `docs/module-guide.md`'s rule (use the handle you are given) keeps a module from making
 * one. Nothing else of the backend depends on it.
 */

export class AsyncLocalStorage<T> {
  getStore(): T | undefined {
    return undefined;
  }

  run<R, A extends unknown[]>(_store: T, callback: (...args: A) => R, ...args: A): R {
    return callback(...args);
  }
}

export class AsyncResource {
  static bind<F extends (...args: never[]) => unknown>(callback: F): F {
    return callback;
  }
}
