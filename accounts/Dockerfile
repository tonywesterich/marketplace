#
# Base
#
FROM node:18-alpine as base

RUN apk update && apk add bash

WORKDIR /app

#
# Build
#
FROM base as build

COPY ./package.json ./
RUN npm install

COPY ./tsconfig.json ./
COPY ./src ./src
RUN npm run build

RUN npm prune --production

#
# Run
#
FROM base as run

COPY --from=build /app/package*.* ./
COPY --from=build /app/dist/ ./dist
COPY --from=build /app/node_modules/ ./node_modules
