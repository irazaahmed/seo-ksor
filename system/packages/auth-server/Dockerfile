# The auth service, as an ordinary container — same shape as the root
# Dockerfile (the MCP door): installs its own package.json, listens on $PORT.
#
# Build context is the repo root (see root vercel.json's `services.auth`), so
# every COPY below is repo-root-relative. Only this package's own files are
# named — not `COPY . ./` — for the same reason the door's Dockerfile gives:
# Vercel's builder does not honour .dockerignore, and an unnamed copy has
# swept in node_modules and other services before (PAYLOAD_TOO_LARGE, found
# live on this repo).

FROM node:24-alpine

WORKDIR /app

COPY system/packages/auth-server/package.json ./
RUN npm install --omit=dev --no-audit --no-fund

COPY system/packages/auth-server/auth.ts ./
COPY system/packages/auth-server/server.ts ./

ENV PORT=80
EXPOSE 80

CMD ["node", "server.ts"]
