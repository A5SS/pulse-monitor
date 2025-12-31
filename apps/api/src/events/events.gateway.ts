import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: process.env.WEB_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger(EventsGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  emitCheckUpdate(serviceId: string, checkRun: any) {
    this.server.emit('check.created', {
      serviceId,
      checkRun,
    });
    this.server.emit('service.updated', {
      serviceId,
      lastStatus: checkRun.status,
      lastLatencyMs: checkRun.latencyMs,
    });
  }

  emitAlert(serviceId: string, alert: any) {
    this.server.emit('alert.triggered', {
      serviceId,
      ...alert,
    });
  }
}

