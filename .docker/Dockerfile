# Stage 1: Base (Dependencies)
FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npx prisma generate

# Stage 2: Development
FROM base AS dev
# Install additional dev dependencies if needed, though they are already in base
ENV NODE_ENV=development
CMD ["npm", "run", "start:dev"]

# Stage 3: Build (Production artifacts)
FROM base AS builder
RUN npm run build

# Stage 4: Production (Runner)
FROM node:20-alpine AS prod
WORKDIR /app
# Only copy production dependencies and build results
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

RUN apk add --no-cache openssl
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/main"]
