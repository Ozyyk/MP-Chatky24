FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Install TypeScript globally
RUN npm install -g typescript

# Copy tsconfig and source files
COPY tsconfig.json ./
COPY . ./src/

# Build the TypeScript code
RUN tsc

# Copy other necessary files
COPY . .

EXPOSE 5002

# Run the compiled JavaScript
CMD ["node", "dist/server.js"]