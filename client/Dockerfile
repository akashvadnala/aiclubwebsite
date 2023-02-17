# Use the alpine image 
FROM node:latest as builder

# Set the workdir 
WORKDIR /app
# Add the node dependencies to the path.
ENV PATH /app/node_modules/.bin:$PATH

# Install dependencies.
COPY package.json ./
COPY package-lock.json ./
RUN npm install --force

# Copy the code.
COPY . ./

# Build the public directory.
RUN npm run build
