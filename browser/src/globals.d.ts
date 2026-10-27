/** The configuration module the build bundles (`browser/build.ts`): `./config.ts`, or a test's. */
declare module "umbradb:configuration" {
  const configuration: import("./configuration.js").BrowserConfiguration;
  export default configuration;
}

/** The negative control a build was made for (`browser/build.ts`), or the empty text. */
declare const __UMBRADB_BROWSER_CONTROL__: string;
