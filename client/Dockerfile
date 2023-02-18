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

FROM nginx
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html
