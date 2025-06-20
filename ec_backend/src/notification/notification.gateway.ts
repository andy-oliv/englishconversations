import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('notification')
  handleMessage(client: Socket, payload: any) {
    const userId: string = client.handshake.query.userId as string;
    return userId;
  }
}
