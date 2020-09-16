FROM node:14-alpine

# Use tini to handle signal forwarding.
RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]

# Run as a non-root user. Create the app dir first, otherwise WORKDIR will create it as root.
USER node
RUN mkdir /home/node/app
WORKDIR /home/node/app

ENV NODE_ENV production
EXPOSE 5000
CMD ["node", "build/index.js"]

# Install dependencies, copy build files, done!
COPY package*.json ./
RUN npm ci
COPY build build
