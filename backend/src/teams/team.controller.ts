import { Controller, Get } from "@nestjs/common";
import { Team } from "././team.schema.js";
import { TeamService } from "./team.service.js";

@Controller("teams")
export class TeamController {
  constructor(private teamService: TeamService) {}

  @Get()
  async getTeams(): Promise<Team[]> {
    return this.teamService.findAll();
  }
}
