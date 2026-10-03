# Use lightweight official Node.js Alpine image
FROM node:22-alpine

WORKDIR /app

# Copy dependency definitions
COPY package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev

# Copy application code
COPY . .

# Expose HTTP port 8080
EXPOSE 8080

ENV PORT=8080
ENV NODE_ENV=production

# Start Node.js Express Server
CMD ["node", "server/index.js"]

