import { Inject, Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { Services } from '../../utils/constants/services';
import { IUserService } from '../../user/interfaces/user.service';
import { UserEntity } from '../../user/user.entity';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject(Services.USERS)
    private readonly userService: IUserService,
  ) {
    super();
  }

  serializeUser(user: UserEntity, done: (err: any, id?: any) => void): void {
    done(null, user);
  }

  async deserializeUser(
    user: UserEntity,
    done: (err: any, id?: any) => void,
  ): Promise<void> {
    const userDb = await this.userService.findUser({ id: user.id });
    return userDb ? done(null, userDb) : done(null, null);
  }
}
