import "reflect-metadata";
import express, { Request, Response } from "express";

import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";
import { COOKIE_NAME, __prod__ } from "./constants";

const app = express();

declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

// session stuff
const RedisStore = connectRedis(session);
//const redis = new Redis(process.env.REDIS_URL);  // for prod
const redis = new Redis();
app.set("trust proxy", 1);
app.use(
  cors({
    // origin: process.env.CORS_ORIGIN, prod only
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(
  session({
    name: COOKIE_NAME,
    store: new RedisStore({
      client: redis,
      disableTouch: true,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
      httpOnly: true,
      sameSite: "lax", // csrf
      secure: __prod__, // cookie only works in https
      // domain: __prod__ ? ".codeponder." : undefined,
    },
    saveUninitialized: false,
    // secret: process.env.SESSION_SECRET, for prod
    secret: "my-secret",
    resave: false,
  })
);

app.get("/express", (_: Request, res: Response) =>
  res.send("<h1>Hello, world, sebou sangare, again</h1>")
);

export default app;
