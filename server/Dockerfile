# pull official base image
FROM node:16.18.0

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install 

# add app
COPY . ./
ENV PORT=5000
EXPOSE 5000

CMD ["npm", "run", "start"]
