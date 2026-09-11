import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { TeamService } from "../services/team.service.js";
import { TeamDto } from "../dto/team.dto.js";
import { AuthGuard } from "../../authentication/auth.guard.js";
import { IsObjectIdPipe } from "@nestjs/mongoose";

@Controller("teams")
@UseGuards(AuthGuard)
export class TeamController {
  constructor(private teamService: TeamService) {}

  @Get()
  async getTeams(): Promise<TeamDto[]> {
    return this.teamService.findAll();
  }

  @Get(":teamId")
  async getTeamById(
    @Param("teamId", IsObjectIdPipe) teamId: string,
  ): Promise<TeamDto> {
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
    @Param("teamId", IsObjectIdPipe) teamId: string,
    @Body() team: TeamDto,
  ): Promise<TeamDto> {
    return this.teamService.updateTeam(teamId, team);
  }

  @Delete(":teamId")
  async delete(@Param("teamId", IsObjectIdPipe) teamId: string) {
    await this.teamService.delete(teamId);
  }
}
