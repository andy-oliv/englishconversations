import { UseGuards } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebsocketGuard } from '../auth/guards/websocket/websocket.guard';
import AuthSocket from '../common/types/AuthSocket';
import Payload from '../common/types/Payload';
import { Logger } from 'nestjs-pino';

@WebSocketGateway({
  cors: { origin: 'http://localhost:5173', credentials: true },
  namespace: 'notifications',
})
@UseGuards(WebsocketGuard)
export class NotificationGateway {
  constructor(private readonly logger: Logger) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('notification')
  handleMessage(client: AuthSocket, payload: any) {
    const user: Payload = client.user;

    return { message: `Olá, ${user.name}, recebemos a sua notificação` };
  }
}
