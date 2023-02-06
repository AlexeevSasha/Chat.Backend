import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { hashPassword } from '../utils/helpers/hashPassword';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  email: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({ select: false })
  password: string;

  @BeforeInsert()
  async hashPassword() {
    if (!this.password) return;
    this.password = await hashPassword(this.password);
  }
}
