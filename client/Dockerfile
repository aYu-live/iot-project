# 基于官方Node镜像
FROM node:20.12.2

# 设置工作目录
WORKDIR /app

# 复制package.json和pnpm-lock.yaml文件
COPY ./package.json ./pnpm-lock.yaml /app/

# 安装globals
RUN npm config set registry https://registry.npmmirror.com/
RUN npm install -g pnpm@9.0.4

# 安装client依赖
RUN pnpm install


# 复制所有其它文件到工作目录
COPY . .