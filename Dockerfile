FROM node:24-alpine AS build

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts

COPY . .
RUN pnpm run build

FROM build AS migration

CMD ["pnpm", "run", "db:migrate"]

FROM build AS production-deps

RUN pnpm prune --prod

FROM node:24-alpine AS production

WORKDIR /app
ENV NODE_ENV=production

COPY --from=production-deps /app/package.json ./
COPY --from=production-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

EXPOSE 8079

CMD ["node", "dist/main.js"]
