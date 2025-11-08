# ------------------------------------------------------------
# Stage 1: Build the Next.js app
# ------------------------------------------------------------
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ------------------------------------------------------------
# Stage 2: Production image
# ------------------------------------------------------------
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=9002

# Copy build output and package files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package*.json ./

# (Optional) Copy public folder only if it exists
COPY --from=builder /app/public ./public 

RUN npm ci --omit=dev

EXPOSE 9002
CMD ["npm", "start"]
