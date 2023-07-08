import express from "express";
import chokidar from "chokidar";
import compression from "compression";
import morgan from "morgan";

import { createRequestHandler } from "@remix-run/express";
import { type ServerBuild, broadcastDevReady } from "@remix-run/node";

const PROJECT_ROOT = process.cwd()
const BUILD_PATH = `${PROJECT_ROOT}/.remix/build/index.js`;

let build: ServerBuild = await import(`${BUILD_PATH}`);

const app = express();

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by");

// Remix fingerprints its assets so we can cache forever.
app.use(
  "/dist",
  express.static(`${PROJECT_ROOT}/.remix/public/build`, { immutable: true, maxAge: "1y" })
);

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static(`${PROJECT_ROOT}/public`, { maxAge: "1h" }));

app.use(morgan("tiny"));


app.all(
  "*",
  process.env.NODE_ENV === "development"
    ? createDevRequestHandler()
    : createRequestHandler({
        build,
        mode: process.env.NODE_ENV,
      })
);

const port = process.env.PORT || 3000;
app.listen(port, async () => {
  console.log(`Express server listening on port ${port}`);

  if (process.env.NODE_ENV === "development") {
    broadcastDevReady(build);
  }
});

function createDevRequestHandler() {
  const watcher = chokidar.watch(BUILD_PATH, { ignoreInitial: true });

  watcher.on("all", async () => {
    let build: ServerBuild = await import(`${BUILD_PATH}?t=${Date.now()}`);
    broadcastDevReady(build);
  });

  return async (req: any, res: any, next: any) => {
    try {
      //
      return createRequestHandler({
        build: build,
        mode: "development",
      })(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}
