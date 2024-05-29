# 基于官方Node镜像
FROM node:lts

# 设置工作目录
WORKDIR /app

# 复制package.json和pnpm-lock.yaml文件
COPY ./package.json ./pnpm-lock.yaml /app/

# 安装globals
RUN npm install -g pnpm@latest

# 安装client依赖
RUN pnpm install


# 复制所有其它文件到工作目录
COPY . .