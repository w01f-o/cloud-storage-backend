FROM node:20.11.1-alpine AS base

RUN apk add --no-cache curl

FROM base AS deps
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN yarn prisma generate
RUN yarn build

FROM base AS runner
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./
COPY --from=builder /app/tsconfig.json ./

EXPOSE 5000

ENV NODE_ENV=production
ENV PORT=5000

CMD ["yarn", "start:migrate:prod"]
