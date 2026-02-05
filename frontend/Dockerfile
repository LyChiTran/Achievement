# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and config files first
COPY package.json package-lock.json* ./
COPY tsconfig.json jsconfig.json next.config.js ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Debug: List files to verify structure (will remove later)
RUN ls -la && ls -la src/ && ls -la src/lib/

# Build the application (Next.js will create standalone output)
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Expose port
EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Start the application
CMD ["node", "server.js"]
