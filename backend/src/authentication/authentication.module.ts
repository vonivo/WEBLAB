import { Module } from "@nestjs/common";
import { WebAuthNController } from "./webauthn.controller.js";
import { CacheModule } from "@nestjs/cache-manager";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./user.schema.js";
import { UserService } from "./user.service.js";
import { JwtModule, JwtSignOptions } from "@nestjs/jwt";
import { ConfigModule, ConfigType } from "@nestjs/config";
import jwtConfig from "../config/jwt.config.js";
import { AuthenticationService } from "./authentication.service.js";
import { AuthGuard } from "./auth.guard.js";

@Module({
  imports: [
    CacheModule.register(),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(jwtConfig)],
      global: true,
      inject: [jwtConfig.KEY],
      useFactory: (config: ConfigType<typeof jwtConfig>) => ({
        secret: config.accessTokSecret,
        signOptions: {
          expiresIn:
            config.accessTokenExpiration as JwtSignOptions["expiresIn"],
        },
      }),
    }),
  ],
  controllers: [WebAuthNController],
  providers: [UserService, AuthenticationService, AuthGuard],
  exports: [AuthGuard],
})
export class AuthenticationModule {}
