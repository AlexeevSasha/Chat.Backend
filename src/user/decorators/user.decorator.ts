import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IJwtPayload } from '../../auth/interfaces/jwt.payload';

export const GetUser = createParamDecorator(
  (data: keyof IJwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.user) return null;

    if (!data) return request.user;
    return request.user[data];
  },
);
