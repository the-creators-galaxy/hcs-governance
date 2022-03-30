FROM node:17-alpine as build
ARG API_ENDPOINT
ENV VITE_API_ROOT=$API_ENDPOINT
WORKDIR /src
COPY . .
RUN npm ci
RUN npm run build

FROM nginx:alpine AS final
WORKDIR /usr/share/nginx/html
COPY --from=build /src/dist .
COPY nginx.conf /etc/nginx/nginx.conf