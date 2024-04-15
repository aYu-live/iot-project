# 基于官方Node镜像
FROM node:20 

# 设置工作目录
WORKDIR /app

# 复制package.json和pnpm-lock.yaml文件
COPY ./package.json ./pnpm-lock.yaml /app/

# 安装pnpm全局包
RUN npm install -g pnpm

# 安装依赖
RUN pnpm install

# 复制其它所有文件到工作目录
COPY ./ /app

# 构建应用
RUN npm run build

CMD ["ls"]
# 打包产物已准备好，可以被后端使用