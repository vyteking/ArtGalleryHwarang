# Build stage: type-check and bundle the app into static files.
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# Vite inlines VITE_* values at build time, so the API address is a build argument.
ARG VITE_API_URL=http://localhost:8000/
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Runtime stage: serve only the built files. Node, the sources and the dev server are not included.
FROM nginx:stable-alpine

# Origin of the API, allowed by the Content-Security-Policy. Set it at `docker run` time.
ENV API_ORIGIN=http://localhost:8000

COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
