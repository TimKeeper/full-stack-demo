# Build Stage
FROM node:18-alpine AS builder

RUN corepack enable

WORKDIR /app

# Copy the entire monorepo
COPY . .

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the frontend
RUN pnpm -F frontend build

# Production Stage
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/frontend/dist /usr/share/nginx/html

# Copy Nginx configuration
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
