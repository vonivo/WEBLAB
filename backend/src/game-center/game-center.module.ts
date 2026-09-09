import { Module } from "@nestjs/common";
import { TeamController } from "./controller/team.controller.js";
import { TeamService } from "./services/team.service.js";
import { MongooseModule } from "@nestjs/mongoose";
import { Team, TeamSchema } from "./schema/team.schema.js";
import { AuthenticationModule } from "../authentication/authentication.moudule.js";
import { GameController } from "./controller/game.controller.js";
import { Game, GameSchema } from "./schema/game.schema.js";
import { GameService } from "./services/game.service.js";

@Module({
  imports: [
    AuthenticationModule,
    MongooseModule.forFeature([
      { name: Team.name, schema: TeamSchema },
      { name: Game.name, schema: GameSchema },
    ]),
  ],
  controllers: [TeamController, GameController],
  providers: [TeamService, GameService],
})
export class GameCenterModule {}
