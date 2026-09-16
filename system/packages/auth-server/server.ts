/**
 * The auth service's entrypoint — an ordinary Node http server, same shape as
 * the door's own container (`ENV PORT`, nothing host-specific).
 */

import { createServer } from "node:http";

import { toNodeHandler } from "better-auth/node";

import { auth } from "./auth.ts";

const port = Number(process.env["PORT"] ?? 80);

const server = createServer(toNodeHandler(auth));

server.listen(port, () => {
  console.log(`auth server listening on :${port}`);
});
