import { Injectable } from '@nestjs/common';
import { IUserService } from './interfaces/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { IUserFindParam } from './interfaces/user';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findUser(param: IUserFindParam): Promise<UserEntity> {
    return this.userRepository.findOneBy(param);
  }
}
