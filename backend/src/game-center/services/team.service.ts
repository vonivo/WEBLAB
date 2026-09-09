import { Model } from "mongoose";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Team, TeamDocument } from "../schema/team.schema.js";
import { TeamDto, UpdateTeamDto } from "../dto/team.dto.js";

@Injectable()
export class TeamService {
  constructor(@InjectModel(Team.name) private teamModel: Model<Team>) {}

  async create(team: TeamDto) {
    const createdTeam = new this.teamModel(team);
    return createdTeam.save();
  }

  async findAll(): Promise<Team[]> {
    return this.teamModel.find().exec();
  }

  async findById(teamId: string): Promise<TeamDocument | null> {
    return this.teamModel.findById(teamId);
  }

  async updateTeam(teamId: string, team: UpdateTeamDto) {
    const updatedTeam = await this.teamModel
      .findByIdAndUpdate(
        teamId,
        { $set: team },
        { returnDocument: "after", runValidators: true },
      )
      .lean();

    if (!updatedTeam) {
      throw new NotFoundException(`Team with ID ${teamId} not found`);
    }

    return updatedTeam;
  }

  async delete(teamId: string) {
    return this.teamModel.deleteOne({ _id: teamId });
  }
}
