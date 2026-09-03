import { Controller, Get } from "@nestjs/common";
import { Team } from "./team.entity.js";
import { TeamService } from "./team.service.js";

@Controller("teams")
export class TeamController {
  constructor(private teamService: TeamService) {}

  @Get()
  getTeams(): Team[] {
    return this.teamService.findAll();
  }
}
