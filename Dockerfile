
# stage 1: build image
FROM node:20-bullseye-slim AS builder

WORKDIR /app

# install deps
COPY package.json package-lock.json ./
RUN npm ci

# copy source
COPY . .

# prisma client + build
RUN npx prisma generate
RUN npm run build

# prune devDependencies
RUN npm prune --omit=dev

# stage 2: start project
FROM node:20-bullseye-slim

WORKDIR /app
ENV NODE_ENV=production

# Install OpenSSL 1.1 runtime for Prisma
RUN apt-get update -y \
	&& apt-get install -y --no-install-recommends openssl libssl1.1 \
	&& rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./package.json

EXPOSE 3000

CMD ["node", "dist/main.js"]


# 2.07GB
# 500MB
# 350MB
