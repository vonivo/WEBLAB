import { Module } from "@nestjs/common";
import { TeamController } from "./team.controller.js";
import { TeamService } from "./team.service.js";
import { MongooseModule } from "@nestjs/mongoose";
import { Player, PlayerSchema, Team, TeamSchema } from "./team.schema.js";
import { AuthenticationModule } from "../authentication/authentication.moudule.js";

@Module({
  imports: [
    AuthenticationModule,
    MongooseModule.forFeature([
      { name: Team.name, schema: TeamSchema },
      { name: Player.name, schema: PlayerSchema },
    ]),
  ],
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamsModule {}
