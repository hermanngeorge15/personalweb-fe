# 💻 Local Development Guide

## ✅ Prerequisites

1. **Backend running** on `http://localhost:8891`
2. **Node.js** installed (v18+)
3. **pnpm** installed (`npm install -g pnpm`)
4. **`.env.local`** file created (see below)

---

## 🚀 Quick Start

### 1. Create `.env.local` (one-time setup)

```bash
cat > .env.local << 'EOF'
# Development environment configuration
VITE_API_BASE_URL=http://localhost:8891

# Keycloak configuration (development)
VITE_KEYCLOAK_URL=https://keycloak.kotlinserversquad.com
VITE_KEYCLOAK_REALM=personalblog
VITE_KEYCLOAK_CLIENT_ID=personalblog-fe
VITE_KEYCLOAK_CHECK_SSO=true

# Development features
VITE_USE_MSW=false
VITE_MOCK_NOTIFICATIONS=false
EOF
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Start Backend

In your backend directory:
```bash
./gradlew bootRun
# OR
./gradlew bootRun --args='--spring.profiles.active=dev'
```

Backend should be running on: `http://localhost:8891`

### 4. Start Frontend

```bash
pnpm dev
```

Frontend opens on: `http://localhost:5173`

---

## 🔍 How It Works

### API Calls in Development
All API calls automatically use `http://localhost:8891/api/...`:

```typescript
// Example: Fetching posts
// Calls: http://localhost:8891/api/posts
const posts = await api('/posts')

// Example: Creating project (authenticated)
// Calls: http://localhost:8891/api/projects
const project = await apiAuth('/projects', await authHeader(), {
  method: 'POST',
  body: JSON.stringify({ name: 'My Project', ... })
})
```

### Environment Detection

The code automatically detects if you're in development:

```typescript
// src/lib/api.ts
const API_BASE = import.meta.env.PROD
  ? '/api'                           // Production: relative path
  : import.meta.env.VITE_API_BASE_URL // Development: http://localhost:8891
```

- **Development Mode** (`pnpm dev`): `import.meta.env.PROD = false`
- **Production Build** (`pnpm build`): `import.meta.env.PROD = true`

---

## 🛠️ Common Development Tasks

### Run Development Server
```bash
pnpm dev
```

### Build for Production (test)
```bash
pnpm build
```

### Preview Production Build (locally)
```bash
pnpm build
pnpm preview
```

### Type Checking
```bash
pnpm type-check
```

### Linting
```bash
pnpm lint
```

### Format Code
```bash
pnpm format
```

---

## 🐛 Troubleshooting

### ❌ "Failed to fetch" errors

**Problem:** API calls fail with CORS or network errors

**Solution:**
1. Check backend is running: `curl http://localhost:8891/api/meta`
2. Verify `.env.local` exists and has correct `VITE_API_BASE_URL`
3. Check backend CORS is enabled for development:
   ```yaml
   # Backend application.yml
   cors:
     enabled: true
     allowed-origins: http://localhost:5173,http://localhost:3000
   ```

### ❌ Keycloak authentication fails

**Problem:** Redirect loops or "invalid client" errors

**Solution:**
1. Verify Keycloak client `personalblog-fe` exists
2. Check Valid Redirect URIs include:
   - `http://localhost:5173/*`
   - `http://localhost:3000/*`
3. Verify `.env.local` has correct `VITE_KEYCLOAK_CLIENT_ID=personalblog-fe`

### ❌ Hot reload not working

**Problem:** Changes don't reflect in browser

**Solution:**
1. Check Vite dev server is running (should show in terminal)
2. Hard refresh browser: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
3. Clear browser cache
4. Restart dev server: `Ctrl+C` then `pnpm dev`

### ❌ Port 5173 already in use

**Solution:**
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use a different port
pnpm dev --port 3000
```

---

## 📋 Development Checklist

Before starting development:

- [ ] Backend running on `http://localhost:8891`
- [ ] `.env.local` file exists with correct settings
- [ ] Dependencies installed (`pnpm install`)
- [ ] Can access backend: `curl http://localhost:8891/api/meta`
- [ ] Keycloak dev client configured (`personalblog-fe`)

---

## 🔄 Workflow Example

### Typical Development Flow

1. **Start Backend**
   ```bash
   cd ../backend
   ./gradlew bootRun
   ```

2. **Start Frontend** (in new terminal)
   ```bash
   cd frontend
   pnpm dev
   ```

3. **Open Browser**
   - Navigate to `http://localhost:5173`
   - Changes auto-reload

4. **Make Changes**
   - Edit files in `src/`
   - See changes instantly in browser

5. **Test API Integration**
   - Use browser DevTools Network tab
   - Check requests go to `http://localhost:8891/api/...`
   - Verify responses

---

## 🌐 Environment Variables Reference

| Variable | Development | Production | Purpose |
|----------|-------------|------------|---------|
| `VITE_API_BASE_URL` | `http://localhost:8891` | Not set | Backend API base URL |
| `VITE_KEYCLOAK_URL` | `https://keycloak.kotlinserversquad.com` | Same | Keycloak server URL |
| `VITE_KEYCLOAK_REALM` | `personalblog` | Same | Keycloak realm |
| `VITE_KEYCLOAK_CLIENT_ID` | `personalblog-fe` | `personalweb-fe-prod` | Keycloak client |
| `VITE_KEYCLOAK_CHECK_SSO` | `true` | `true` | Enable SSO check |

---

## 🎯 Quick Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run linter
pnpm lint

# Run type checker
pnpm type-check

# Format code
pnpm format

# Clean build artifacts
rm -rf dist node_modules/.vite
```

---

## 📚 Additional Resources

- **Vite Documentation**: https://vitejs.dev/
- **React Router (TanStack)**: https://tanstack.com/router
- **Keycloak JS Adapter**: https://www.keycloak.org/docs/latest/securing_apps/#_javascript_adapter
- **HeroUI Components**: https://heroui.com/

---

**Happy coding! 🚀**

