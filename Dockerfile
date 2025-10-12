# ---- Build ----
    FROM node:24-alpine AS build
    WORKDIR /app
    RUN corepack enable && corepack prepare pnpm@10.0.0 --activate
    COPY package.json pnpm-lock.yaml ./
    RUN pnpm install --frozen-lockfile
    COPY . .
    # Ensure FE uses relative URLs (fetch('/api/...'), EventSource('/api/sse'))
    RUN pnpm build
    
    # ---- Runtime ----
    FROM nginx:1.27-alpine
    COPY ./deploy/nginx.conf /etc/nginx/conf.d/default.conf
    COPY --from=build /app/dist /usr/share/nginx/html
    EXPOSE 80
    HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
      CMD wget -qO- http://localhost/ || exit 1
    