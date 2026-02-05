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

# Build the application (Next.js will create standalone output)
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy necessary files from builder (make public optional)
RUN mkdir -p ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# Copy public if it exists (use shell to avoid error if missing)
RUN if [ -d "/app/public" ]; then cp -r /app/public/* ./public/ 2>/dev/null || true; fi

# Expose port
EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Start the application
CMD ["node", "server.js"]
