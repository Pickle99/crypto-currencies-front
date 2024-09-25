FROM node:18-alpine AS runtime
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY .next ./.next
COPY public ./public
EXPOSE 3000
USER node
CMD ["npm","start"]