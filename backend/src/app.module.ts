import { Module } from "@nestjs/common";
import { AppController } from "./app.controller.js";
import { TeamsModule } from "./teams/teams.module.js";

@Module({
  imports: [TeamsModule],
  controllers: [AppController],
})
export class AppModule {}
