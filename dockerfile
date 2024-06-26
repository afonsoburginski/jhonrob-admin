FROM node:18.17.0-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build
FROM node:18.17.0-alpine AS runtime

WORKDIR /app

COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next
COPY --from=build /app/package*.json ./
RUN npm install --production

EXPOSE 3000

CMD ["npm", "run", "start"]
