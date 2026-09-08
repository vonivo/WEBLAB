export interface AuthenticationResult {
  verified: boolean;
  jwt: JWT;
}

export interface JWT {
  accessToken: string;
}
