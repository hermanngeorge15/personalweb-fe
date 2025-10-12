# Production Setup - Quick Reference

## Backend URL
**Production Backend**: `https://app.jirihermann.com`

## Build & Deploy

### 1. Build Docker Image
```bash
docker build -t blog-fe .
```

### 2. Run Container
```bash
docker run -d -p 80:80 --name blog-fe blog-fe
```

### 3. Verify
```bash
curl http://localhost/health
# Should return: healthy
```

## Override Backend URL

If you need to use a different backend URL:

```bash
docker build --build-arg VITE_API_URL=https://different-backend.com -t blog-fe .
```

## What Gets Built

The Docker image includes:
- ✅ Frontend application with React 19
- ✅ Backend API URL: `https://app.jirihermann.com` (baked in at build time)
- ✅ Nginx web server with SPA routing
- ✅ Gzip compression enabled
- ✅ Static asset caching (1 year)
- ✅ Health check endpoint at `/health`

## API Communication

The frontend makes direct HTTPS requests to:
```
https://app.jirihermann.com/api/*
https://app.jirihermann.com/session/*
https://app.jirihermann.com/sse/*
https://app.jirihermann.com/actuator/*
```

## Backend Requirements

Your backend at `app.jirihermann.com` MUST:
1. ✅ Support HTTPS
2. ✅ Have CORS enabled for your frontend domain
3. ✅ Accept credentials (cookies) from frontend
4. ✅ Return proper `Access-Control-Allow-*` headers

### Example Backend CORS Configuration (Spring Boot)

```kotlin
@Configuration
class CorsConfig : WebMvcConfigurer {
    override fun addCorsMappings(registry: CorsRegistry) {
        registry.addMapping("/**")
            .allowedOrigins("https://your-frontend-domain.com")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true)
    }
}
```

## Port Mapping

- Container exposes port `80`
- Map to any host port: `-p HOST_PORT:80`
- Examples:
  - `-p 80:80` → http://localhost
  - `-p 8080:80` → http://localhost:8080
  - `-p 3000:80` → http://localhost:3000

## Troubleshooting

### API calls fail with CORS errors
→ Check backend CORS configuration allows your frontend domain

### API calls fail with connection refused  
→ Verify backend is accessible at `https://app.jirihermann.com`

### Page shows "Network Error"
→ Check browser console for specific error
→ Verify backend is running and accessible

### Health check fails
→ Container may not have started correctly
→ Check logs: `docker logs blog-fe`

## File Structure

```
/
├── Dockerfile              # Build configuration with VITE_API_URL
├── deploy/
│   └── nginx.conf         # Nginx server configuration
├── DEPLOYMENT.md          # Detailed deployment guide
└── README.production.md   # This file
```

## Need Help?

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed information.

