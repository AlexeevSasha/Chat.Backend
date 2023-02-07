export interface IJwtPayload {
  email: string;
  sub: number;
}

export interface JwtPayloadRefresh extends JwtPayload {
  refreshToken: string;
}
