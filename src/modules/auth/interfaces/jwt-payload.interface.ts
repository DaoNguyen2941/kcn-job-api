export interface JwtAccessPayload {
  sub: string; // admin_user_id
  username: string;
}

export interface JwtRefreshPayload {
  sub: string; // admin_user_id
  tokenId: string;
}
