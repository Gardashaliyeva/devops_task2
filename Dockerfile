# Use the official Node.js 16 image as a parent image
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any dependencies
RUN npm install --only=production

# Copy the rest of the app's source code from the host to the image filesystem.
COPY . .

# Inform Docker that the container is listening on the specified port at runtime.
EXPOSE 3000

# Define the command to run your app using CMD which defines your runtime.
# Here we will use node start to run the server.js file of the app.
CMD ["node", "server.js"]
