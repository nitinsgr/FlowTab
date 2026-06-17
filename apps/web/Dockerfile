FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --only=production && npm cache clean --force

FROM base AS development
RUN npm install --include=dev
COPY . .
EXPOSE 80
CMD ["npm", "start"]

FROM base AS production
COPY . .
EXPOSE 80
CMD ["npm", "start"]
