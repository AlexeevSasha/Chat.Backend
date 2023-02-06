import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IAuthService } from './interfaces/auth.service';
import { IUserLogin } from '../user/interfaces/user';
import { compareHashPassword } from '../utils/helpers/hashPassword';
import { UserEntity } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async validateUser({ email, password }: IUserLogin): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['email', 'id', 'password', 'firstname', 'lastname'],
    });
    if (!user) {
      throw new HttpException(
        'Wrong password or login',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const checkPassword = await compareHashPassword(password, user.password);
    if (!checkPassword) {
      throw new HttpException(
        'Wrong password or login',
        HttpStatus.UNAUTHORIZED,
      );
    }

    delete user.password;

    return user;
  }
}
