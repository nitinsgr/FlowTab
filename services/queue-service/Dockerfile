FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --only=production && npm cache clean --force

FROM base AS development
RUN npm install --include=dev
COPY . .
EXPOSE 3000
CMD ["node", "--watch", "src/index.js"]

FROM base AS production
COPY . .
EXPOSE 3000
CMD ["node", "src/index.js"]
