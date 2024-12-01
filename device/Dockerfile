# Stage 1: Build
FROM oven/bun AS builder

# Set the working directory
WORKDIR /source

# Copy all necessary files
COPY package.json bun.lockb tsconfig.json ./
COPY src ./src

# Install dependencies
RUN bun install

# Bundle the application into a static executable
RUN bun build src/index.ts --compile --outfile ./binary

# Stage 2: Production
FROM debian:stable-slim

# Install necessary shared libraries (if needed)
RUN apt-get update && apt-get install -y libstdc++6 libc6

# Set the working directory
WORKDIR /app

# Copy the static executable from the build stage
COPY --from=builder /source/binary ./binary

# Expose the application's port
EXPOSE 3000

# Specify the static executable as the entrypoint
ENTRYPOINT ["/app/binary"]
