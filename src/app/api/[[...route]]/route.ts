import { Hono } from "hono";
import { handle } from "hono/vercel";
import { initAuthConfig } from "@hono/auth-js";

import images from "./images";
import users from "./users";
import projects from "./projects";
import subscriptions from "./subscriptions";
import ai from "./ai";
import authConfig from "@/auth.config";

export const runtime = "nodejs";

const app = new Hono().basePath("/api");

// to protect the routes
app.use(
  "*",
  initAuthConfig((c) => {
    return {
      secret: process.env.AUTH_SECRET,
      ...(authConfig as any),
    };
  })
);

const routes = app
  .route("/images", images)
  .route("/users", users)
  .route("/ai", ai)
  .route("/projects", projects)
  .route("/subscriptions", subscriptions);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
