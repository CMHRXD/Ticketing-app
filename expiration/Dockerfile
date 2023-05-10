FROM node:alpine

WORKDIR /usr/app

COPY ./package*.json ./
#
RUN npm install --only=production

COPY ./ ./

CMD ["npm", "run", "service"]