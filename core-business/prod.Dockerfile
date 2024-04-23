#
# Base
#
FROM node:current-alpine as base

RUN apk update && apk add bash

WORKDIR /app

#
# Build
#
FROM base as build

COPY ./package.json ./
RUN npm install

COPY ./database ./database
RUN npm run db:generate

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
COPY --from=build /app/database/ ./database
