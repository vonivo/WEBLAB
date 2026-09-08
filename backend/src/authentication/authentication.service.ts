import { Injectable } from "@nestjs/common";
import { UserDocument } from "./user.schema.js";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthenticationService {
  constructor(private jwtService: JwtService) {}

  async generateAccessToken(user: UserDocument) {
    const payload = { sub: user.id, username: user.username };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
