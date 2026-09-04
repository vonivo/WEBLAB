import { Module } from "@nestjs/common";
import { AppController } from "./app.controller.js";
import { TeamsModule } from "./teams/teams.module.js";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [TeamsModule, MongooseModule.forRoot("mongodb://mongo:27017/")],
  controllers: [AppController],
})
export class AppModule {}
