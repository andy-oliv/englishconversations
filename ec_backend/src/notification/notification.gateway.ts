import { ExecutionContext, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { WebsocketGuard } from '../auth/guards/websocket/websocket.guard';
import AuthSocket from '../common/types/AuthSocket';
import { Logger } from 'nestjs-pino';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
  namespace: 'api/notifications',
})
export class NotificationGateway implements OnGatewayConnection {
  constructor(
    private readonly logger: Logger,
    private readonly websocketGuard: WebsocketGuard,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: AuthSocket, ...args: any[]) {
    const context = {
      switchToWs: () => ({
        getClient: () => client,
      }),
    } as unknown as ExecutionContext;

    try {
      const canActivate = await this.websocketGuard.canActivate(context);

      if (!canActivate) {
        client.disconnect();
        return;
      }

      const user = client.user;
      if (user?.id) {
        client.join(user.id);
      } else {
        client.disconnect();
      }
    } catch (err) {
      client.disconnect();
    }
  }
}
