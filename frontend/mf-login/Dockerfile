# Use Bun base image
FROM oven/bun:1

# Set working directory
WORKDIR /mf-login

# Copy package files
COPY package*.json ./

# Install dependencies using Bun
RUN bun install

# Copy the rest of the application
COPY . .

# Expose the port
EXPOSE 3021

# Start the application using Bun
CMD ["bun", "start"]