# Use official Node.js image (lightweight and secure)
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy all source files
COPY . .

# Build the Next.js app
RUN npm run build

# ------------------------------------------------------------
# Production stage
# ------------------------------------------------------------
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

# Copy only necessary files from builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Start the Next.js server
CMD ["npm", "start"]
