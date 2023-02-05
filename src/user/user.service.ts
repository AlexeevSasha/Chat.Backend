import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IUserService } from './interfaces/user.service';
import { CreateUserDto } from './dtos/createUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  createUser(userDetails: CreateUserDto) {
    const existEmail = this.userRepository.findOneBy({
      email: userDetails.email,
    });

    if (existEmail) {
      throw new HttpException('test', HttpStatus.UNAUTHORIZED);
    }
  }
}
