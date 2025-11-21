# Install dependencies — separate layer for caching
FROM node:22-slim AS deps

WORKDIR /app

# Install OS deps if needed by sharp or other packages
# RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json* ./

RUN npm ci --prefer-offline --no-audit --legacy-peer-deps


# Build stage — compiles Next.js and Tailwind CSS
FROM node:22-slim AS builder

WORKDIR /app

COPY . .
COPY --from=deps /app/node_modules ./node_modules

RUN npm run build


# Production runner — lightweight, optimized
FROM node:22-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy only required artifacts from the build
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]