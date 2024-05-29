# Dockerfile
# Use the official lightweight Node.js 18 image
FROM node:18.17.0-alpine AS build

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the source code
COPY . .

# Build the Next.js application
RUN npm run build

# Use another lightweight Node.js image for the runtime
FROM node:18.17.0-alpine AS runtime

# Set the working directory
WORKDIR /app

# Copy the built Next.js app and node_modules to the runtime image
COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next

# Expose the port Next.js will run on
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "run", "start"]
