
# stage 1: giai đoạn để build ra image
FROM node:24-alpine AS builder

WORKDIR /app

# thay đổi thư viện thêm/ xoá thư viện
COPY package.json ./
RUN npm install

# thay đổi code
COPY . .

RUN npx prisma generate

RUN npm run build

# xoá thư viện devDependencies
RUN npm prune --production

# stage 2: start project
FROM node:24-alpine

WORKDIR /app

COPY --from=builder ./app/dist ./dist
COPY --from=builder ./app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder ./app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder ./app/node_modules ./node_modules

CMD ["node", "dist/main.js"]

# 2.07GB
# 500MB
# 350MB
