# The human surface plus the front door for a self-hosted deployment.
#
# Stage 1 builds the static site exactly as `npm run build` does locally.
# Stage 2 serves it with nginx, which also does what vercel.json's rewrites did:
# /mcp, /health, /ready and the OAuth metadata go to the `door` container,
# /api/auth/* goes to the `auth` container, everything else is the static site.
#
# Build context is the repo root; deploy/web.Dockerfile.dockerignore bounds it.

FROM node:24-alpine AS build
RUN apk add --no-cache git
WORKDIR /app
COPY . .
RUN npm install --no-audit --no-fund
RUN npm run build

FROM nginx:1.27-alpine
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/system/site/out /usr/share/nginx/html
EXPOSE 80
