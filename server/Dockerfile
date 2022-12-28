FROM node:18-alpine as base
WORKDIR /app

FROM node:18-alpine as build
WORKDIR /src
COPY . .
RUN npm ci
RUN npm run build

FROM base AS final
WORKDIR /app
COPY --from=build /src/package.json .
COPY --from=build /src/package-lock.json .
RUN npm ci --production=true
COPY --from=build /src/dist ./dist
ENTRYPOINT ["node", "dist/main"]


