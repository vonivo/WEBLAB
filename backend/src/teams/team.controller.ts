import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { TeamService } from "./team.service.js";
import type { TeamDto, UpdateTeamDto } from "./team.dto.js";

@Controller("teams")
export class TeamController {
  constructor(private teamService: TeamService) {}

  @Get()
  async getTeams(): Promise<TeamDto[]> {
    return this.teamService.findAll();
  }

  @Get(":teamId")
  async getTeamById(@Param("teamId") teamId: string): Promise<TeamDto> {
    const team = await this.teamService.findById(teamId);
    if (!team) {
      throw new NotFoundException(`Team with ID ${teamId} not found`);
    }

    return team;
  }

  @Post()
  async create(@Body() team: TeamDto): Promise<TeamDto> {
    return this.teamService.create(team);
  }

  @Put(":teamId")
  async updateTeam(
    @Param("teamId") teamId: string,
    @Body() team: UpdateTeamDto,
  ): Promise<TeamDto> {
    return this.teamService.updateTeam(teamId, team);
  }

  @Delete(":teamId")
  async delete(@Param("teamId") teamId: string) {
    await this.teamService.delete(teamId);
  }
}
