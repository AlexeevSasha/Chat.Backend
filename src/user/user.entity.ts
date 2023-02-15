import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { hash } from 'argon2';
import { MessageEntity } from '../message/message.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({ select: false })
  password: string;

  @Column({ select: false, nullable: true })
  refresh_token: string;

  @OneToMany(() => MessageEntity, (message) => message.author)
  @JoinColumn()
  messages: MessageEntity[];

  @BeforeInsert()
  async hashPassword() {
    if (!this.password) return;
    this.password = await hash(this.password);
  }
}
