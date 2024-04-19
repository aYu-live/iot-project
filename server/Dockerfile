# 基于官方Node镜像
FROM node:lts

# 设置工作目录
WORKDIR /app


# 安装globals
RUN npm install -g pnpm@latest

# 复制package.json和pnpm-lock.yaml文件
COPY ./package.json ./pnpm-lock.yaml /app/

# 安装依赖
RUN pnpm install


# 复制所有其它文件到工作目录
COPY . /app/
# 暂时不复制前端文件，此步将会在 docker-compose 或在构建流程中解决


# 构建应用
RUN npm run build

EXPOSE 3000 3001