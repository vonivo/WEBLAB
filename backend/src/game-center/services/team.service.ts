import { Model } from "mongoose";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Team, TeamDocument } from "../schema/team.schema.js";
import { TeamDto } from "../dto/team.dto.js";
import { MongoServerError } from "mongodb";

@Injectable()
export class TeamService {
  constructor(@InjectModel(Team.name) private teamModel: Model<Team>) {}

  async create(team: TeamDto) {
    try {
      const createdTeam = new this.teamModel(team);
      return await createdTeam.save();
    } catch (err) {
      if (err instanceof MongoServerError && err.code === 11000) {
        throw new BadRequestException(
          `Team with name "${team.name}" already exists`,
        );
      }
      throw err;
    }
  }

  async findAll(): Promise<Team[]> {
    return this.teamModel.find().exec();
  }

  async findById(teamId: string): Promise<TeamDocument | null> {
    return this.teamModel.findById(teamId);
  }

  async updateTeam(teamId: string, team: TeamDto) {
    try {
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
    } catch (err) {
      if (err instanceof MongoServerError && err.code === 11000) {
        throw new BadRequestException(
          `Team with name "${team.name}" already exists`,
        );
      }
      throw err;
    }
  }

  async delete(teamId: string) {
    return this.teamModel.deleteOne({ _id: teamId });
  }
}
