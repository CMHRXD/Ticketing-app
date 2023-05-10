FROM node:alpine

# this is for ci/cd
ENV CI=true 

#install package globally
RUN npm install -g serve

#set working directory
WORKDIR /app

#copy package.json and package-lock.json
COPY ./package*.json ./

#install dependencies
RUN npm install

#copy source code
COPY ./ ./

#build the app
RUN npm run build

#run the app
CMD serve -s dist -p 5173
