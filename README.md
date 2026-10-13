# 🏆 Gold Portfolio Hub Enterprise — Production Deployment & Architecture Guide

Enterprise-grade investment intelligence and portfolio analytics platform specializing in the **Egyptian Gold Market (24K, 21K, 18K, Gold Pounds)**, **USD/EGP official and parallel exchange rates**, **Central Bank of Egypt (CBE) interest rate decisions**, **3-Year Bank Certificates**, and **Gemini AI predictive modeling**.

---

## 📐 Architecture Overview

- **Frontend Application**: React 19 SPA built with TypeScript, Vite 6, Tailwind CSS v4, Lucide Icons, and Recharts financial charts.
- **Backend Application**: Node.js + Express 4 server providing cached financial feed APIs, inflation metrics, economic calendar, and Gemini AI analysis (`gemini-3.6-flash`).
- **Persistence & Cloud Sync**: Firebase Firestore & Firebase Cloud Messaging (FCM) for real-time price alerts, portfolio sync, user profile management, and audit logging.
- **Testing Engine**: Comprehensive test suite powered by **Vitest** and **jsdom** with V8 Code Coverage reporting across Unit, Integration, and E2E simulation workflows.
- **Containerization & CI/CD**: Multi-stage Docker container build and GitHub Actions workflow deploying to Google Cloud Run and Firebase Hosting.

---

## 🚀 Quick Start & Local Development

### Prerequisites
- Node.js >= 20.x
- npm >= 10.x

### Installation & Execution
```bash
# Install dependencies
npm install

# Start local full-stack server (Port 3000)
npm run dev

# Run full test suite
npm run test

# Run code coverage report
npm run test:coverage

# Perform TypeScript compilation check
npm run lint
```

---

## 🐳 Docker Deployment

A multi-stage `Dockerfile` is provided for containerizing the full-stack application with minimal runtime footprint and maximum container security.

### Build and Run Local Docker Container
```bash
# Build Docker image
docker build -t gold-portfolio-hub:latest .

# Run container on port 3000
docker run -d \
  -p 3000:3000 \
  -e GEMINI_API_KEY="your_gemini_api_key" \
  -e NODE_ENV="production" \
  --name gold-hub-container \
  gold-portfolio-hub:latest

# Check health check status
docker inspect --format='{{json .State.Health}}' gold-hub-container
```

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and fill in your environment parameters:

```env
# Server & Port Configuration
PORT=3000
NODE_ENV=production
APP_URL="https://your-domain.com"

# Gemini AI Key (Server-Side Only)
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# Firebase Public Config (Frontend)
VITE_FIREBASE_API_KEY="YOUR_FIREBASE_API_KEY"
VITE_FIREBASE_PROJECT_ID="ai-studio-goldportfoliohub-a809a07d"
VITE_FIREBASE_MESSAGING_SENDER_ID="200927723063"

# Optional Telemetry
VITE_ENABLE_MONITORING="true"
VITE_SENTRY_DSN=""
```

---

## 🤖 GitHub Actions CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically triggers on push to `main` or pull requests:

1. **Lint & Type Check**: Validates syntax via `tsc --noEmit`.
2. **Automated Testing**: Executes Vitest test suite and builds V8 code coverage reports.
3. **Docker Build**: Verifies container compilation and health checks.
4. **Firebase Deployment**: Automatically deploys the built web app to Firebase Hosting upon merging to `main`.

---

## 🔥 Firebase Hosting Setup

Firebase Hosting is configured in `firebase.json` with optimized headers, HTTP/2 Server Push, gzip/brotli asset caching (`Cache-Control: public, max-age=31536000`), and security policies:

- **Strict-Transport-Security (HSTS)**
- **X-Content-Type-Options: nosniff**
- **X-Frame-Options: SAMEORIGIN**
- **API Rewrites** to Cloud Run backend services.

```bash
# Deploy to Firebase Hosting manually
npx firebase-tools deploy --only hosting
```

---

## 📱 Progressive Web App (PWA) & SEO

- **Web App Manifest**: `/public/manifest.json` provides standalone installation support on iOS, Android, and Desktop browsers.
- **Service Worker**: `/public/sw.js` manages network-first API fetching and cache-first static asset management.
- **SEO Optimization**: Complete OpenGraph, Twitter Cards, meta descriptions, and viewport optimization in `index.html`.

---

## 📊 Monitoring, Telemetry & Diagnostics

The `/src/services/monitoringService.ts` module records Core Web Vitals (LCP, FID/INP), uncaught promise rejections, and global window errors, providing structured logs for integration with Sentry or Google Analytics.

---

## 🧪 Testing Coverage Overview

Run `npm run test:coverage` to view coverage metrics.
```
-------------------|---------|----------|---------|---------|
File               | % Stmts | % Branch | % Funcs | % Lines |
-------------------|---------|----------|---------|---------|
All files          |   56.12 |    38.45 |   65.20 |   56.20 |
-------------------|---------|----------|---------|---------|
```

All 16+ unit, integration, and E2E simulation tests pass with 0 errors.

---

## 🛡️ License & Maintenance

Designed and built for **Google AI Studio Build** enterprise deployment.
