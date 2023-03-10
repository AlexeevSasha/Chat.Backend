import { MessageEntity } from '../message.entity';
import { ICreateMessageResponse } from './message.response';
import { ICreateMessageParam, IDeleteMessageParams } from './message.param';

export interface IMessageService {
  createMessage: (
    param: ICreateMessageParam,
  ) => Promise<ICreateMessageResponse>;
  getMessages: (id: string) => Promise<MessageEntity[]>;
  deleteMessage: (param: IDeleteMessageParams) => Promise<any>;
}
