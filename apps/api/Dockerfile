FROM node:20-alpine

RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Copy root workspace files
COPY package.json package-lock.json ./
# Copy all package.json files for workspaces
COPY packages/shared/package.json ./packages/shared/
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/

# Install dependencies for the whole workspace
RUN npm install

# Copy shared package and API source code
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api

WORKDIR /app/apps/api

# Generate Prisma client
RUN npx prisma generate

EXPOSE 4000

CMD ["npm", "run", "dev"]

# For production, use:
# CMD ["npm", "run", "start:prod"]
