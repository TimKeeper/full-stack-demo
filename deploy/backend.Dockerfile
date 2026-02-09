FROM node:18-alpine

RUN corepack enable

WORKDIR /app

# Copy the entire monorepo to ensure workspace dependencies are resolved
COPY . .

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the backend
RUN pnpm -F backend build

# Expose application port
EXPOSE 3000

# Start command
CMD ["pnpm", "-F", "backend", "start:prod"]
