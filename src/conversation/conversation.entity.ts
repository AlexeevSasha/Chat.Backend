import {
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { MessageEntity } from '../message/message.entity';

@Entity('conversations')
@Index(['creator.id', 'recipient.id'], { unique: true })
export class ConversationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => UserEntity, { createForeignKeyConstraints: false })
  @JoinColumn()
  creator: UserEntity;

  @OneToOne(() => UserEntity, { createForeignKeyConstraints: false })
  @JoinColumn()
  recipient: UserEntity;

  @OneToMany(() => MessageEntity, (message) => message.conversation, {
    cascade: ['insert', 'remove', 'update'],
  })
  @JoinColumn()
  messages: MessageEntity[];

  @OneToOne(() => MessageEntity)
  @JoinColumn({ name: 'last_message' })
  lastMessage: MessageEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: number;
}
