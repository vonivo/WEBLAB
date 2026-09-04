import { Body, Controller, Get, Post } from "@nestjs/common";
import { TeamService } from "./team.service.js";
import type { TeamDto } from "./team.dto.js";

@Controller("teams")
export class TeamController {
  constructor(private teamService: TeamService) {}

  @Get()
  async getTeams(): Promise<TeamDto[]> {
    return this.teamService.findAll();
  }

  @Post()
  async create(@Body() team: TeamDto): Promise<TeamDto> {
    return this.teamService.create(team);
  }
}
