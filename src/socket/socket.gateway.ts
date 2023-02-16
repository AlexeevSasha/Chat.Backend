import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';

@WebSocketGateway(8001, {
  cors: {
    origin: ['http://localhost:5500'],
    methods: ['GET', 'POST'],
  },
})
export class MessagingGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket, ...args) {
    console.log('New Incoming Connection');
    console.log(client.id, args);
    client.emit('connected', { status: 'good' });
  }
  @SubscribeMessage('createMessage')
  handleCreateMessage(@MessageBody() data: string) {
    console.log('Create Message', data);
  }

  @OnEvent('message.create')
  handleMessageCreateEvent(payload) {
    console.log('Inside message.create');
    console.log(payload);
    this.server.emit('onMessage', payload);
  }
}
