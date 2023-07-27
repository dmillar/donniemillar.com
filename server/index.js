import * as fs from "node:fs";

import { createRequestHandler } from "@remix-run/express";
import { broadcastDevReady, installGlobals } from "@remix-run/node";
import chokidar from "chokidar";
import compression from "compression";
import express from "express";
import morgan from "morgan";
import crypto from "crypto";
import rfs from "rotating-file-stream";

installGlobals();

const BUILD_PATH = `${process.cwd()}/.remix/build/server/entryServer.js`;
/**
 * @type { import('@remix-run/node').ServerBuild | Promise<import('@remix-run/node').ServerBuild> }
 */
let build = await import(BUILD_PATH);

const app = express();
app.enable("trust proxy");

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by");

// Remix fingerprints its assets so we can cache forever.
app.use(
  "/build",
  express.static(`${process.cwd()}/.remix/build/client`, {
    immutable: true,
    maxAge: "1y",
  })
);

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static(`${process.cwd()}/public`, { maxAge: "1h" }));

app.use(
  morgan(
    function (tokens, req, res) {
      const responseTime = tokens["response-time"](req, res);
      var logData = {
        request_id: crypto.randomUUID(),
        timestamp: tokens["date"](req, res, "iso"),
        method: tokens.method(req, res),
        url: tokens.url(req, res),
        status: tokens.status(req, res),
        response_time: parseFloat(responseTime),
        referrer: tokens["referrer"](req, res),
        agent: tokens["user-agent"](req, res),
        accept_lang: req.headers["accept-language"],
        ip: tokens["remote-addr"](req, res),
      };

      return JSON.stringify(logData);
    },
    {
      stream: rfs.createStream("./logs/http.log", {
        size: "10M",
        compress: true,
      }),
    }
  ),
  process.env.NODE_ENV === "development" ? morgan("dev") : null
);

app.all(
  "*",
  process.env.NODE_ENV === "development"
    ? createDevRequestHandler()
    : createRequestHandler({
        build: build,
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
    // 1. purge require cache && load updated server build
    const stat = fs.statSync(BUILD_PATH);
    build = import(BUILD_PATH + "?t=" + stat.mtimeMs);
    // 2. tell dev server that this app server is now ready
    broadcastDevReady(await build);
  });

  return async (req, res, next) => {
    try {
      return createRequestHandler({
        build: await build,
        getLoadContext(req, res) {
          return { req, res };
        },
        mode: "development",
      })(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}
