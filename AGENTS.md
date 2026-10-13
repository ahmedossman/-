# Gold Portfolio Hub Enterprise — System Instructions & Conventions

## Overview
This codebase is an enterprise investment intelligence application for the Egyptian gold market, USD/EGP exchange rates, bank certificates, and Gemini 3.6 Flash AI analytics.

## Coding Conventions
1. **TypeScript First**: All components and services must be strictly typed.
2. **Server-Side API Keys**: Keep all secret keys (like `GEMINI_API_KEY`) on the server in `server.ts`. Frontend uses proxy routes `/api/ai/*`.
3. **Tailwind CSS & Styling**: Use Tailwind CSS utilities. Ensure responsive breakpoints (`sm:`, `md:`, `lg:`).
4. **Localization**: Support bilingual interface (English and Arabic) using `language === 'AR'`.
5. **Port & Infrastructure**: Server runs on host `0.0.0.0` and port `3000`.

## Key Modules
- `/src/services/aiPlatform.ts`: Core AI platform engine (Portfolio Optimization, Rebalancing, Tax/Zakat, Risk & Inflation, Market Regime Detection, Scenario Matrix, Executive Reports, Investment Coach).
- `/src/components/widgets/`: AI Widgets for interactive analytics.
- `/server.ts`: Express backend serving production SPA assets and API proxy endpoints.
