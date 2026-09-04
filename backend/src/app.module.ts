import { Module } from "@nestjs/common";
import { AppController } from "./app.controller.js";
import { TeamsModule } from "./teams/teams.module.js";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    TeamsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>("MONGODB_URI"),
        user: config.get<string>("MONGODB_USER"),
        pass: config.get<string>("MONGODB_PASS"),
      }),
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
