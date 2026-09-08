import { registerAs } from "@nestjs/config";

export interface JwtConfig {
  accessTokSecret: string;
  accessTokenExpiration: string;
  refreshTokenSecret: string;
  refreshTokenExpiration: string;
}

export default registerAs("jwt", (): JwtConfig => ({
  accessTokSecret: process.env.JWT_ACCESS_TOKEN_SECRET!,
  accessTokenExpiration: process.env.JWT_ACCESS_TOKEN_EXPIRATION ?? "1m",
  refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET!,
  refreshTokenExpiration: process.env.JWT_REFRESH_TOKEN_SECRET ?? "7d",
}));
