import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IUserService } from './interfaces/user.service';
import { CreateUserDto } from './dtos/createUser.dto';
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

  async createUser(userDetails: CreateUserDto) {
    const existEmail = await this.userRepository.findOneBy({
      email: userDetails.email,
    });
    if (existEmail) {
      throw new HttpException(
        'This email already exists',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const user = this.userRepository.create(userDetails);
    return this.userRepository.save(user);
  }

  async findUser(param: IUserFindParam): Promise<UserEntity> {
    return this.userRepository.findOneBy(param);
  }
}
