# ベースイメージ
FROM mcr.microsoft.com/devcontainers/typescript-node:22


# Puppeteer が必要とするライブラリをインストール
RUN apt-get update && apt-get install -y \
    libnspr4 \
    libnss3 \
    libxss1 \
    libasound2 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxcomposite1 \
    libxrandr2 \
    libgbm1 \
    libgtk-3-0 \
    libxdamage1 \
    libx11-xcb1 \
    fonts-liberation \
    xdg-utils \
    wget \
    ca-certificates \
    --no-install-recommends \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Angular インストール
RUN npm install -g @angular/cli
