import { Module } from "@nestjs/common";
import { AppController } from "./app.controller.js";
import { GameCenterModule } from "./game-center/game-center.module.js";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService, ConfigType } from "@nestjs/config";
import { AuthenticationModule } from "./authentication/authentication.moudule.js";
import { CacheModule } from "@nestjs/cache-manager";
import webauthnConfig from "./config/webauthn.config.js";
import mongoConfig from "./config/mongo.config.js";
import { envValidationSchema } from "./config/env.validation.js";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [webauthnConfig, mongoConfig],
      validationSchema: envValidationSchema,
    }),
    GameCenterModule,
    AuthenticationModule,
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register(),
    MongooseModule.forRootAsync({
      inject: [mongoConfig.KEY],
      useFactory: (config: ConfigType<typeof mongoConfig>) => ({
        uri: config.uri,
        user: config.user,
        pass: config.pass,
      }),
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
