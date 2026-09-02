# Mentor.ai — Production Deployment & Hardening Guide

This guide documents the technical architecture, operational prerequisites, configuration requirements, security considerations, and deployment instructions for **MENTOR.AI**.

---

## 1. Important Security & Sandboxing Architecture

> [!WARNING]
> **Production Hardening Requirement**:
> MENTOR.AI features a production-oriented full-stack architecture with modular components, strict type-checking, and server-side secret protection.
>
> However, the built-in development code runner uses host-level subprocess execution (`child_process.spawn`) with wall-clock timeouts (5-7 seconds), output buffer caps (64KB), and payload limits (128KB). While this is safe for local single-user development and private controlled testing, **it does NOT provide kernel-level cgroup, memory, or network isolation**.
>
> **In a public, multi-tenant production deployment, arbitrary user-submitted code MUST NOT be executed directly on the main application server.**

### Recommended Public Production Architecture

```
┌─────────────────┐       ┌──────────────────────┐       ┌───────────────────────────┐
│                 │ HTTPS │                      │ HTTPS │ Isolated Sandbox Engine   │
│ Client Browser  ├──────►│ Express API Server   ├──────►│ (Judge0 / Piston / nsjail)│
│                 │       │ (/api/execute)       │       │ - Kernel Namespaces       │
└─────────────────┘       └──────────────────────┘       │ - Memory/CPU cgroups      │
                                                         │ - Network Disabled        │
                                                         └─────────────┬─────────────┘
                                                                       │
                                                                       ▼
                                                          Execution Result (stdout/stderr)
```

Recommended isolated execution engines:
- [Judge0](https://judge0.com/) — Robust open-source code execution system.
- [Piston](https://github.com/engineer-man/piston) — High-performance multi-language execution engine.
- Dedicated ephemeral container worker clusters using `nsjail` or `gVisor`.

---

## 2. System Prerequisites

- **Node.js**: `v18.0.0` or higher (`v20.x LTS` recommended)
- **Package Manager**: `npm` (v9+)
- **Operating System**: Linux (Ubuntu 22.04 LTS / Debian 12 recommended for production containers), macOS, or Windows
- **Optional Language Runtimes** (for local code runner support on the host):
  - `node` & `tsx` (included via dependencies for JS/TS)
  - `python3` (must be installed on the host machine/container if Python problem execution is enabled)

---

## 3. Environment Variables Configuration

Create a `.env` file in the project root or configure these variables in your hosting platform's environment settings:

| Variable Name | Required | Scope | Secret? | Description | Example Value |
|---|---|---|---|---|---|
| `GEMINI_API_KEY` | **Yes** | Server-Side Only | **YES** | Google AI Studio / Gemini API Secret Key | `AIzaSy...` |
| `PORT` | Optional | Server-Side Only | No | Ingress port bound by the server (defaults to 3000) | `3000` |
| `NODE_ENV` | Optional | Server-Side Only | No | Node environment flag | `production` |
| `ENABLE_LOCAL_CODE_EXECUTION` | Optional | Server-Side Only | No | Toggle direct host code execution (`true` or `false`) | `true` |

> [!CAUTION]
> **Never** expose `GEMINI_API_KEY` to the browser or prefix it with `VITE_`. All AI requests are securely proxied through Express API endpoints.

---

## 4. Build & Start Commands

### Installation
```bash
npm ci
```

### Production Build
```bash
npm run build
```
*This command executes `vite build` (bundling the React frontend into `dist/`) followed by `esbuild server.ts` (bundling the backend into a standalone CommonJS executable at `dist/server.cjs`).*

### Production Start
```bash
npm start
```
*This runs `node dist/server.cjs`, listening on `0.0.0.0` and `PORT` (default: 3000).*

---

## 5. Network & Routing Specifications

### Health Check Endpoint
- **Path**: `GET /api/health`
- **Expected Response**: `{"status": "ok", "apiConnected": true}` with HTTP 200

### Server-Side API Routes (Must NOT be bypassed or made client-side)
- `POST /api/mentor/chat` — AI Mentor conversation streaming and context handling
- `POST /api/mentor/action` — Rapid code error analysis, optimization, explanation, and testing
- `POST /api/mentor/interview/questions` — Dynamic role-specific mock interview question generation
- `POST /api/mentor/interview/score` — Multi-dimensional rubric scoring with grounded AI evaluation
- `POST /api/execute` — Single-file code execution runner
- `POST /api/execute/testcases` — Automated test case evaluation harness

### Static File Serving
- Express serves the compiled frontend assets from `/dist`.
- Any non-API route (`*`) automatically falls back to `/dist/index.html` to support client-side Single Page Application (SPA) routing.

---

## 6. Rate Limiting Recommendations

When deploying behind a reverse proxy (e.g., Cloudflare, NGINX, or AWS ALB), configure rate limiting on the following endpoints:

| Endpoint | Recommended Limit (per IP) | Rationale |
|---|---|---|
| `/api/mentor/chat` | 20 requests / minute | Protects Gemini token quota |
| `/api/mentor/action` | 15 requests / minute | Protects Gemini token quota |
| `/api/mentor/interview/score` | 10 requests / minute | Intensive analysis query |
| `/api/execute*` | 30 executions / minute | Prevents CPU exhaustion on host |

---

## 7. Client-Side Data & Device Portability

The application uses an **offline-first `localStorage` architecture**:

### Stored Locally in Browser:
- User Profile (`mentor_ai_user_profile`)
- Activity & Submission History (`mentor_ai_activity`)
- AI Chat History (`mentor_ai_chat_history`)
- Mock Interview Sessions (`mentor_ai_interview_*`)
- Problem Editor Drafts (`mentor_ai_editor_code_*`)
- Application Settings (`mentor_ai_settings`)

### Multi-Device Portability Note:
- Because data is stored in the browser's `localStorage`, **user progress, XP, streak counts, and activity logs do not sync across different devices or browsers**.
- Clearing browser cache/cookies will reset the application to its default initial state.

---

## 8. Deployment Platform Recipes

### Option A: Google Cloud Run (Recommended Container Platform)

1. Create a `Dockerfile`:
```dockerfile
FROM node:20-slim

WORKDIR /app

# Install Python for multilingual execution support
RUN apt-get update && apt-get install -y python3 && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["node", "dist/server.cjs"]
```

2. Deploy using Google Cloud CLI:
```bash
gcloud run deploy mentor-ai \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "NODE_ENV=production" \
  --set-secrets "GEMINI_API_KEY=GEMINI_API_KEY:latest"
```

---

### Option B: Railway / Render / Fly.io

1. **Build Command**: `npm ci && npm run build`
2. **Start Command**: `npm start`
3. **Port**: Set `PORT` to `3000` (or allow the platform to auto-assign via `process.env.PORT`).
4. **Environment Variables**: Add `GEMINI_API_KEY` in the service settings.

---

## 9. Verification Checklist Post-Deployment

- [ ] `GET /api/health` returns HTTP 200 `{"status": "ok"}`.
- [ ] Navigating to the root URL `/` loads the Mentor.ai Dashboard.
- [ ] AI Mentor answers questions without exposing `GEMINI_API_KEY` in browser DevTools.
- [ ] Coding Workspace compiles and runs JavaScript/Python test cases.
- [ ] Learning Roadmap (26 topics) and Practice Problems (59 problems) render accurately.
- [ ] Progress Dashboard accurately calculates analytics from user submissions.

