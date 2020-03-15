# base image
FROM node:12.2.0-alpine as builder

# set working directory
WORKDIR /app/

# Copy all important files for the installation
COPY mylife/package.json ./

RUN npm install -g

COPY mylife/ .

RUN npm run build

# FROM node:12.2.0-alpine

# RUN yarn global add serve

# WORKDIR /app/
# COPY --from=builder /app/build .

# EXPOSE 80

# CMD ["serve", "-p", "80", "-s", "."]
