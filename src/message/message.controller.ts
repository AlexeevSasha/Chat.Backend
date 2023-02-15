import { Controller, Inject, UseGuards } from '@nestjs/common';
import { Routes } from '../utils/constants/routes';
import { AuthGuard } from '../auth/guards/AuthGuard';
import { Services } from '../utils/constants/services';
import { IMessageService } from './interfaces/message.service';

@Controller(Routes.MESSAGES)
@UseGuards(AuthGuard)
export class MessageController {
  constructor(
    @Inject(Services.MESSAGES)
    private readonly messageService: IMessageService,
  ) {}
}
