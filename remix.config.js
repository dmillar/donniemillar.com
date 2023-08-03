/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/.*", "api.*"],
  cacheDirectory: "./.remix/cache",
  // appDirectory: "app",
  assetsBuildDirectory: "./.remix/build/client",
  serverBuildPath: "./.remix/build/server/entryServer.js",
  publicPath: "/build/",
  serverModuleFormat: "esm",
  watchPaths: "./server/*",
  tailwind: true,
  serverMinify: true,
  future: {
    v2_dev: true,
    v2_errorBoundary: true,
    v2_headers: true,
    v2_meta: true,
    v2_normalizeFormMethod: true,
    v2_routeConvention: true,
  },
};