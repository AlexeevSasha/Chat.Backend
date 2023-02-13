import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJwtPayload, IJwtPayloadRefresh } from '../interfaces/jwt.payload';
import { Request } from 'express';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const token = request?.cookies['refresh_token'];
          return !token ? null : token;
        },
      ]),
      secretOrKey: process.env.REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: IJwtPayload): IJwtPayloadRefresh {
    const refreshToken =
      req.cookies &&
      'refresh_token' in req.cookies &&
      req.cookies.refresh_token.length > 0;

    if (!refreshToken) throw new ForbiddenException('Refresh token malformed');

    return {
      ...payload,
      refreshToken: req.cookies.refresh_token,
    };
  }
}
