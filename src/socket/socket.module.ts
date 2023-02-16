import { Module } from '@nestjs/common';
import { MessagingGateway } from './socket.gateway';

@Module({ providers: [MessagingGateway] })
export class SocketModule {}
