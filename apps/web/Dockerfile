FROM node:20-alpine

RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Copy root workspace files
COPY package.json package-lock.json ./
# Copy all package.json files for workspaces
COPY packages/shared/package.json ./packages/shared/
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/

# Install dependencies
RUN npm install

# Copy shared package and Web source code
COPY packages/shared ./packages/shared
COPY apps/web ./apps/web

WORKDIR /app/apps/web

EXPOSE 3000

CMD ["npm", "run", "dev"]
