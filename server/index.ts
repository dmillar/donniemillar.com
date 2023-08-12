//import * as fs from "node:fs";

import {} from "dotenv/config";
import fs from "fs";
import { type ServerBuild, broadcastDevReady, installGlobals } from "@remix-run/node";
import { createRequestHandler } from "@remix-run/express";
import chokidar from "chokidar";
import os from "node:os";
import compression from "compression";
import express from "express";
import morgan from "morgan";
import crypto from "crypto";
import rfs from "rotating-file-stream";
import cookieParser from "cookie-parser";
import sourceMapSupport from "source-map-support";
import * as remixBuild from "../.remix/build/server/remix-build.js"

export function createServer(remixBuild: ServerBuild, mode: "production") {

  let app = express();
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

  // fingerprint user so I can log repeat visits :)
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.use((req, res, next) => {
    let userFingerprint = req.signedCookies["user-fingerprint"];
    if (!userFingerprint) {
      const cookieExpires = new Date(
        new Date().setFullYear(new Date().getFullYear() + 10)
      );
      userFingerprint = crypto.randomUUID();
      res.cookie("user-fingerprint", userFingerprint, {
        signed: true,
        expires: cookieExpires,
      });
      req.signedCookies["user"] = userFingerprint;
    }
    next();
  });

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
          referrer: req.headers.referer,
          agent: tokens["user-agent"](req, res),
          accept_lang: req.headers["accept-language"],
          ip: tokens["remote-addr"](req, res),
          user_fingerprint: req.signedCookies["user-fingerprint"],
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
    morgan("tiny")
  );

  app.all(
    "*",
    process.env.NODE_ENV === "development"
      ? createDevRequestHandler()
      : createRequestHandler({
          build: remixBuild,
          mode: process.env.NODE_ENV,
        })
  );
  
  app.all(
    "*",
    mode === "production"
      ? (req, res, next) => {
          let loadContext = (req, res) => { return { req, res } }
          createRequestHandler({ build: remixBuild, loadContext, mode })        
        }
      : (req, res, next) => {
        let loadContext = (req, res) => { return { req, res } }
          // require cache is purged in @remix-run/dev where the file watcher is
          return createRequestHandler({ remixBuild, loadContext, mode })(req, res, next);
        }
  );

  

  // const port = process.env.PORT || 3000;
  // app.listen(port, async () => {
  //   console.log(`Express server listening on port ${port}`);

  //   if (process.env.NODE_ENV === "development") {
  //     broadcastDevReady(remixBuild);
  //   }
  // });

  function createDevRequestHandler() {
    let buildPath = "../.remix/build/server/remix-build.js";
    const watcher = chokidar.watch(buildPath, { ignoreInitial: true });

    watcher.on("all", async () => {
      // 1. purge require cache && load updated server build
      const stat = fs.statSync(buildPath);
      build = import(buildPath + "?t=" + stat.mtimeMs);
      // 2. tell dev server that this app server is now ready
      broadcastDevReady(await remixBuild);
    });

    return async (req, res, next) => {
      try {
        return createRequestHandler({
          build: remixBuild,
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
  return app;
}

sourceMapSupport.install()
installGlobals()

let port = process.env.PORT ? Number(process.env.PORT) : 3000;
if (Number.isNaN(port)) port = 3000;

// let buildPath = path.resolve(process.cwd(), "/.remix/build/server/entry-server.js");
// let build = require(buildPath);

let onListen = () => {
  let address =
    process.env.HOST ||
    Object.values(os.networkInterfaces())
      .flat()
      .find((ip) => String(ip?.family).includes("4") && !ip?.internal)?.address;

  if (!address) {
    console.log(`Remix App Server started at http://localhost:${port}`);
  } else {
    console.log(
      `Remix App Server started at http://localhost:${port} (http://${address}:${port})`
    );
  }
  if (
    remixBuild.future?.v2_dev !== false &&
    process.env.NODE_ENV === "development"
  ) {
    broadcastDevReady(remixBuild);
  }
};

let app = createServer(
  remixBuild,
  process.env.NODE_ENV
);
let server = process.env.HOST
  ? app.listen(port, process.env.HOST, onListen)
  : app.listen(port, onListen);

["SIGTERM", "SIGINT"].forEach((signal) => {
  process.once(signal, () => server?.close(console.error));
});
