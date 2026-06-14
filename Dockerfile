FROM node:22-slim

# Install system dependencies: python3, ffmpeg, curl
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    ffmpeg \
    curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install latest yt-dlp binary directly (fastest, no pip conflicts)
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp \
    -o /usr/local/bin/yt-dlp \
    && chmod a+rx /usr/local/bin/yt-dlp

# Verify tools are available
RUN ffmpeg -version | head -1 && yt-dlp --version

WORKDIR /app

COPY package*.json ./
# Install ALL deps (including devDependencies like esbuild, tsx, typescript)
RUN npm ci

COPY . .
# Build client bundle + server bundle
RUN npm run build

# Strip devDependencies after build to keep the image lean
RUN npm prune --omit=dev

# Temp storage for ephemeral downloads
RUN mkdir -p /app/storage/temp

EXPOSE 3000
CMD ["npm", "start"]
