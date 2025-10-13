# ---- Build ----
    FROM node:24-alpine AS build
    
    # Build args for environment variables
    ARG VITE_API_URL
    ARG VITE_KEYCLOAK_URL
    ARG VITE_KEYCLOAK_REALM
    ARG VITE_KEYCLOAK_CLIENT_ID
    ARG VITE_KEYCLOAK_CHECK_SSO=true
    
    # Set as environment variables for build
    ENV VITE_API_URL=localhost:8891
    ENV VITE_KEYCLOAK_URL=https://keycloak.kotlinserversquad.com
    ENV VITE_KEYCLOAK_REALM=personalblog
    ENV VITE_KEYCLOAK_CLIENT_ID=personalblog-fe
    ENV VITE_KEYCLOAK_CHECK_SSO=${VITE_KEYCLOAK_CHECK_SSO}

    WORKDIR /app
    RUN corepack enable && corepack prepare pnpm@10.0.0 --activate
    COPY package.json pnpm-lock.yaml ./
    RUN pnpm install --frozen-lockfile
    COPY . .
    RUN pnpm build
    
    # ---- Runtime ----
    FROM nginx:1.27-alpine
    COPY ./deploy/nginx.conf /etc/nginx/conf.d/default.conf
    COPY --from=build /app/dist /usr/share/nginx/html
    EXPOSE 80
    HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
      CMD wget -qO- http://localhost/ || exit 1
    