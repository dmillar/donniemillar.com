import morgan from "morgan";
import prisma from "./prisma.server.js";
import crypto from "crypto";

async function logToDb(logData: any) {
    await prisma.requests.create({ data: logData })
}

const logger = morgan(function(tokens, req, res) {

    const responseTime = tokens['response-time'](req, res) as string
    const logData = {
      request_id: crypto.randomUUID(),
      timestamp: tokens['date'](req, res, 'iso'),
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: tokens.status(req, res),
      response_time: parseFloat(responseTime),
      "referrer": tokens['referrer'](req, res),
      "agent": tokens['user-agent'](req, res),
      accept_lang: req.headers["accept-language"],
      ip: tokens['remote-addr'](req, res)
    };
  
    logToDb(logData);
    return JSON.stringify(logData)
  })

  export default logger



