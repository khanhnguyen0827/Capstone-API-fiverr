# stage 1: giai đoạn để build ra image
FROM node:18-alpine AS builder

WORKDIR /app

# thay đổi thư viện thêm/ xoá thư viện
COPY package*.json ./
RUN npm install

# thay đổi code
COPY . .

RUN npx prisma generate

RUN npm run build

# xoá thư viện devDependencies
RUN npm prune --production

# stage 2: start project
FROM node:18-alpine

WORKDIR /app

# Copy built application and dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Expose port
EXPOSE 3069

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3069

# Start application
CMD ["node", "dist/main.js"]