# The auth service, as an ordinary container — same shape as the root
# Dockerfile (the MCP door): installs its own package.json, listens on $PORT.
#
# Build context is THIS DIRECTORY, not the repo root — unlike the root
# Dockerfile (whose context is the repo root because the entrypoint sits
# there), Vercel's container builder uses the entrypoint Dockerfile's own
# directory as the build context. So every COPY below is relative to
# system/packages/auth-server/ itself (confirmed live: a repo-root-relative
# COPY here failed with "no such file or directory").

FROM node:24-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev --no-audit --no-fund

COPY auth.ts ./
COPY server.ts ./

ENV PORT=80
EXPOSE 80

CMD ["node", "server.ts"]
