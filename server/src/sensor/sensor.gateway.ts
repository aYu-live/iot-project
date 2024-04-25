// src/events/events.gateway.ts
import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true, namespace: 'deviceIo' })
export class SensorGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;

  // 当客户端连接时触发
  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}, ${args}`);
    // 你可以在这里初始化逻辑，例如：验证客户端, 加载用户数据等
  }

  // 当客户端断开连接时触发
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    // 你可以在这里清理资源，例如：删除用户游戏状态等
  }

  // 客户端订阅消息的事件处理函数
  @SubscribeMessage('client-message')
  handleClientMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): void {
    console.log(`Message received from client ${client.id}: ${data}`);
    // 这里可以对客户端的消息进行处理
    // 可以调用下面的 broadcastMessage 方法来推送消息给所有客户端
  }

  // 服务端主动推送消息给所有客户端
  broadcastMessage(eventName: string, message: any): void {
    this.server.emit(eventName, message); // 发送给所有客户端
  }

  // 服务端主动推送消息给特定客户端
  sendMessageToClient(clientId: string, eventName: string, message: any): void {
    this.server.to(clientId).emit(eventName, message); // 发送到特定客户端
  }
}
