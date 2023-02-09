import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { IAuthService } from './interfaces/auth.service';
import { UserEntity } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash, verify } from 'argon2';
import { ITokens } from './interfaces/tokens';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { IUserResponse } from './interfaces/user.responce';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(createUser: CreateUserDto): Promise<any> {
    const existEmail = await this.userRepository.findOneBy({
      email: createUser.email,
    });
    if (existEmail) {
      throw new HttpException(
        'This email already exists',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return this.userRepository.save(this.userRepository.create(createUser));
  }

  async validateUser({ email, password }: LoginUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: [
        'email',
        'id',
        'password',
        'firstname',
        'lastname',
        'refresh_token',
      ],
    });
    if (!user) throw new UnauthorizedException('Wrong password or login');

    const checkPassword = await verify(user.password, password);
    if (!checkPassword)
      throw new UnauthorizedException('Wrong password or login');

    return user;
  }

  async logout(id: string): Promise<boolean> {
    const deleteRefresh = await this.userRepository.update(
      { id },
      {
        refresh_token: null,
      },
    );

    return !!deleteRefresh.affected;
  }

  async buildUserResponseWithTokens(user: UserEntity): Promise<IUserResponse> {
    const { access_token, refresh_token } = await this.getTokens(
      user.id,
      user.email,
    );

    await this.updateRefreshHash(user.id, refresh_token);

    delete user.refresh_token;
    delete user.password;

    return { user, access_token, refresh_token };
  }

  async refreshToken(id: string, rt: string): Promise<ITokens> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'email', 'refresh_token'],
    });
    if (!user || !user.refresh_token)
      throw new ForbiddenException('Your access token has expired');

    const checkRefresh = await verify(user.refresh_token, rt);
    if (!checkRefresh)
      throw new ForbiddenException('Your access token has expired');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshHash(user.id, tokens.refresh_token);

    return tokens;
  }

  private async getTokens(id: string, email: string): Promise<ITokens> {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(
        { id, email },
        { secret: process.env.ACCESS_TOKEN_SECRET, expiresIn: '15m' },
      ),
      this.jwtService.signAsync(
        { id, email },
        { secret: process.env.REFRESH_TOKEN_SECRET, expiresIn: '7d' },
      ),
    ]);

    return { access_token, refresh_token };
  }

  private async updateRefreshHash(id: string, rt: string): Promise<void> {
    const hashToken = await hash(rt);
    await this.userRepository.update(
      { id },
      {
        refresh_token: hashToken,
      },
    );
  }
}
