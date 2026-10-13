# Multi-stage Production Dockerfile for Gold Portfolio Hub Enterprise
# Stage 1: Build Phase
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency specifications
COPY package.json package-lock.json* ./

# Install all dependencies including devDependencies for build
RUN npm ci || npm install

# Copy source code and configuration
COPY . .

# Build Vite frontend assets and bundle Express backend to dist/server.cjs
RUN npm run build

# Stage 2: Production Runtime Phase
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Create app user for container security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy built artifacts and necessary runtime configuration
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.env.example ./.env.example

# Set correct permission ownership
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 3000

# Healthcheck configuration
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start production server
CMD ["node", "dist/server.cjs"]
