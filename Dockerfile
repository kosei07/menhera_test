# Alpine Linuxベースの最新バージョンnodeを採用
FROM node:18-alpine
# コンテナ内の作業ディレクトリ
WORKDIR /app

ENV LANG=C.UTF-8 \
 TZ=Asia/Tokyo

COPY package.json yarn.lock ./

RUN yarn

# 5173番でコンテナを公開
EXPOSE 5173