# base image
FROM node as builder

ARG PLATFORM=web

EXPOSE 19000 19001 19002

# set working directory
WORKDIR /app/

# Copy all important files for the installation
COPY mylife/package*.json ./

RUN npm install 
RUN npm install expo-cli

COPY mylife/ ./
RUN npm audit fix

CMD ["expo", "start", "--tunnel"]
