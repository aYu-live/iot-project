# 基于官方Node镜像
FROM hub.rat.dev/library/node:20.12.2

# 设置工作目录
WORKDIR /app


# 安装globals
RUN npm config set registry https://registry.npmmirror.com/
RUN npm install -g pnpm@9.0.4

# 复制package.json和pnpm-lock.yaml文件
COPY ./package.json ./pnpm-lock.yaml /app/

# 安装server依赖
RUN pnpm install


# 复制所有其它文件到工作目录
COPY . /app/
# 暂时不复制前端文件，此步将会在 docker-compose 或在构建流程中解决


# 构建应用
RUN npm run build

EXPOSE 3000 3001