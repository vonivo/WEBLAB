import { Injectable } from "@nestjs/common";
import { Team } from "./team.entity.js";

@Injectable()
export class TeamService {
  private readonly teams: Team[] = [];

  constructor() {
    this.teams.push(
      {
        name: "Boulders Blaster Boys",
        logoPath: "Logo.png",
      },
      {
        name: "Bettbach Firecrackers",
        logoPath: "Logo.png",
      },
    );
  }

  findAll(): Team[] {
    return this.teams;
  }
}
