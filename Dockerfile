# base image
FROM node as builder

ARG PLATFORM=web

# set working directory
WORKDIR /app/

# Copy all important files for the installation
COPY mylife/package*.json ./

RUN npm install -g
RUN npm install expo-cli

COPY mylife/ ./
RUN npm audit fix

RUN npm run build-$PLATFORM

WORKDIR /app/$PLATFORM-build/

RUN yarn global add serve

EXPOSE 80

CMD ["serve", "-p", "80", "-s", "."]
