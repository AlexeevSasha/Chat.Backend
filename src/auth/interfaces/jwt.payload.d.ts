export interface IJwtPayload {
  id: string;
  email: string;
}

export interface IJwtPayloadRefresh extends IJwtPayload {
  refreshToken: string;
}
