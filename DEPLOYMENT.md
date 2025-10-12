# Production Deployment Guide

## Backend Configuration

The frontend is configured to connect to the backend at: **`https://app.jirihermann.com`**

## Docker Build

### Default Build (uses app.jirihermann.com)
```bash
docker build -t blog-fe .
```

### Custom Backend URL
```bash
docker build --build-arg VITE_API_URL=https://your-backend-url.com -t blog-fe .
```

## Docker Run

```bash
docker run -d -p 80:80 --name blog-fe blog-fe
```

## Environment Variables

The following environment variable is baked into the build:

- `VITE_API_URL` - Backend API URL (default: `https://app.jirihermann.com`)

## API Endpoints

The frontend makes direct HTTPS calls to the backend for:
- `/api/*` - REST API endpoints
- `/session/*` - Session management
- `/sse/*` - Server-Sent Events
- `/actuator/*` - Health checks

## CORS Configuration

⚠️ **Important**: The backend at `app.jirihermann.com` must have CORS configured to allow requests from your frontend domain.

Required CORS headers on backend:
```
Access-Control-Allow-Origin: https://your-frontend-domain.com
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

## Nginx Configuration

The nginx server:
- Serves static files with gzip compression
- Handles SPA routing (all routes fall back to index.html)
- Has health check endpoint at `/health`
- Caches static assets for 1 year

## Health Check

```bash
curl http://localhost/health
# Response: healthy
```

## Build Output

- **Image size**: ~50MB (nginx:alpine + built assets)
- **Build time**: ~5-7 seconds (after dependencies are cached)
- **Assets**: Optimized and minified with Vite

## Production Checklist

- [ ] Backend is accessible at `https://app.jirihermann.com`
- [ ] Backend has CORS configured for frontend domain
- [ ] Backend accepts credentials (cookies) from frontend
- [ ] SSL/TLS certificates are valid
- [ ] Health endpoints are accessible
- [ ] Docker image is built with correct VITE_API_URL
- [ ] Container networking allows outbound HTTPS to backend

