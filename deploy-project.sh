#!/bin/bash

# 定义项目目录和 Git 仓库地址
project_dir="project"
iot_project_dir="iot-project"
git_repo="git@github.com:aYu-live/iot-project.git"

# 检查是否存在 project 文件夹，如果不存在则创建
if [ ! -d "$project_dir" ]; then
  echo "Creating $project_dir directory..."
  mkdir "$project_dir"
fi

# 进入 project 文件夹
cd "$project_dir"

# 检查是否存在 iot-project 文件夹，如果不存在则从 Git 仓库克隆
if [ ! -d "$iot_project_dir" ]; then
  echo "Cloning the iot-project repository..."
  git clone "$git_repo"
fi

# 进入 iot-project 文件夹
cd "$iot_project_dir"

# 停止所有容器服务
echo "Shutting down running containers..."
docker-compose down

# 从 Git 仓库获取最新的项目
echo "Pulling the latest version of iot-project repository..."
git pull

# 构建服务并在后台运行
echo "Building and starting services with docker-compose..."
docker-compose up --build -d

echo "All done."