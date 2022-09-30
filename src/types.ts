export type JwtPayload = {
  sub: string;
  username: string;
};

export type JwtResponse = { access_token: string };
