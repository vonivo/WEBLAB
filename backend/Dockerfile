FROM node:24-slim

WORKDIR /app/backend

COPY backend/package*.json ./

RUN npm ci

COPY backend/ ./

RUN npm run build

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/main.js"]