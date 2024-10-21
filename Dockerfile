# フロントエンド用 Dockerfile

# ベースイメージに Ubuntu slim を使用
FROM ubuntu:20.04

# Node.js のインストール
RUN apt-get update && apt-get install -y curl \
    && curl -sL https://deb.nodesource.com/setup_16.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean

# 作業ディレクトリを設定
WORKDIR /app

# package.json と package-lock.json をコピー
COPY package*.json ./

# 依存関係のインストール
RUN npm install

# アプリのソースコードをコピー
COPY . .

# ポートを公開
EXPOSE 5173

# 開発サーバーを起動
CMD ["npm", "run", "dev", "--host"]
