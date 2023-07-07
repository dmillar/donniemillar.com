/** @type {import("@remix-run/dev").AppConfig} */
export default {
  cacheDirectory: "./.remix/cache",
  ignoredRouteFiles: ["**/.*", ".*", "**/*.css", "**/*.test.{js,jsx,ts,tsx}"],
  assetsBuildDirectory: "./.remix/public/build",
  serverBuildPath: "./.remix/build/index.js",
  publicPath: "/dist/",
  serverModuleFormat: "esm",
  serverPlatform: "node",
  tailwind: true,
  postcss: true,
  watchPaths: ["./tailwind.config.ts", "./server/*"],
  future: {
    v2_dev: true,
    v2_errorBoundary: true,
    v2_headers: true,
    v2_meta: true,
    v2_normalizeFormMethod: true,
    v2_routeConvention: true,
  },
};
