FROM node:14

WORKDIR /usr/src/app
ENV NODE_ENV production

COPY package*.json ./
RUN npm ci
COPY build build

EXPOSE 5000
USER node
CMD ["node", "build/index.js"]
