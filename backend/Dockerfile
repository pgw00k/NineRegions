# 仙剑奇侠传九野 本地服务器 — 生产镜像
# 运行期零 npm 依赖（WS / protobuf 均为自研），仅需 typescript 做编译。
FROM node:22-bookworm-slim

# 用 root 安装/编译，最后降到非 root 运行
WORKDIR /app

# 先拷贝依赖与源码（利用层缓存）
COPY package.json tsconfig.json ./
COPY protocol ./protocol
COPY src ./src
COPY tools ./tools

RUN npm install --omit=optional \
  && npm run build \
  && npm prune --omit=dev

# 运行时仅需 Node（已无 dev 依赖）
EXPOSE 8800/tcp
EXPOSE 9002/udp
EXPOSE 8080/tcp

ENV NODE_ENV=production
USER node

CMD ["node", "dist/src/index.js"]
