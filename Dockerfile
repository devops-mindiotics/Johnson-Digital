# ------------------------------------------------------------
# Stage 1: Build the Next.js app
# ------------------------------------------------------------
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy all project files
COPY . .

# Build the app (generates the .next folder)
RUN npm run build

# ------------------------------------------------------------
# Stage 2: Production image
# ------------------------------------------------------------
FROM node:18-alpine AS runner

WORKDIR /app
ENV NODE_ENV=development
ENV PORT=8080

# Copy only the built output and necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Expose the port Cloud Run expects
EXPOSE 9002

# Start Next.js
CMD ["npm", "start"]
