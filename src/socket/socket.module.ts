import { Module } from '@nestjs/common';
import { MessagingGateway } from './socket.gateway';
import { SocketService } from './socket.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [MessagingGateway, SocketService],
})
export class SocketModule {}
