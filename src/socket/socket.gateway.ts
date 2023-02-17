import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';

@WebSocketGateway(+process.env.SOCKET_PORT, {
  transport: ['websocket'],
  cors: {
    origin: ['http://localhost:5500'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class MessagingGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket, ...args) {
    console.log('New Connection');
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
