# ---- Build ----
    FROM node:24-alpine AS build
    
    # Build args for environment variables
    # Note: VITE_API_BASE_URL not needed for production (uses /api via Nginx)
    ARG VITE_KEYCLOAK_URL=https://keycloak.kotlinserversquad.com
    ARG VITE_KEYCLOAK_REALM=personalblog
    ARG VITE_KEYCLOAK_CLIENT_ID=personalweb-fe-prod
    ARG VITE_KEYCLOAK_CHECK_SSO=true
    ARG VITE_RECAPTCHA_SITE_KEY
    ARG GITHUB_RUN_NUMBER
    ARG GITHUB_SHA
    ARG GITHUB_REF_NAME
    
    # Set as environment variables for build
    ENV VITE_KEYCLOAK_URL=${VITE_KEYCLOAK_URL}
    ENV VITE_KEYCLOAK_REALM=${VITE_KEYCLOAK_REALM}
    ENV VITE_KEYCLOAK_CLIENT_ID=${VITE_KEYCLOAK_CLIENT_ID}
    ENV VITE_KEYCLOAK_CHECK_SSO=${VITE_KEYCLOAK_CHECK_SSO}
    ENV VITE_RECAPTCHA_SITE_KEY=${VITE_RECAPTCHA_SITE_KEY}
    ENV GITHUB_RUN_NUMBER=${GITHUB_RUN_NUMBER}
    ENV GITHUB_SHA=${GITHUB_SHA}
    ENV GITHUB_REF_NAME=${GITHUB_REF_NAME}

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
    