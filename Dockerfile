FROM node:alpine AS node_server
WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD [ "npm","start" ]
