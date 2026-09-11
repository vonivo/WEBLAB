import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { TeamService } from "./team.service.js";
import { CreateGameDto, GameEventDto } from "../dto/game.dto.js";
import { Team, TeamDocument } from "../schema/team.schema.js";
import { Player, PlayerDocument } from "../schema/player.schema.js";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import {
  Game,
  GameEvent,
  GameEventType,
  GameSide,
  GameTeam,
} from "../schema/game.schema.js";

@Injectable()
export class GameService {
  constructor(
    private readonly teamService: TeamService,
    @InjectModel(Game.name) private gameModel: Model<Game>,
  ) {}

  async findAll() {
    const result = await this.gameModel.find();
    return result.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
  }

  async findById(id: string) {
    const game: Game | null = await this.gameModel.findById(id);
    if (game) {
      const sortedEvents = game.events.sort((a, b) => {
        const minuteDiff = this.totalMinute(b) - this.totalMinute(a);

        if (b.timeStamp && a.timeStamp) {
          const timeStampA = new Date(a.timeStamp);
          const timeStampB = new Date(b.timeStamp);

          return minuteDiff !== 0
            ? minuteDiff
            : timeStampB.getTime() - timeStampA.getTime();
        }

        return minuteDiff;
      });
    }

    return game;
  }

  async createGame(createGameDto: CreateGameDto) {
    const homeTeam = await this.validateTeam(createGameDto.homeTeamId);
    const awayTeam = await this.validateTeam(createGameDto.awayTeamId);

    if (homeTeam.id === awayTeam.id) {
      throw new BadRequestException("Game must consist of two separate teams");
    }

    const lineUpHome = this.validatePlayersOfTeam(
      homeTeam,
      createGameDto.lineupHomeTeam,
    );
    const lineUpAway = this.validatePlayersOfTeam(
      awayTeam,
      createGameDto.lineupAwayTeam,
    );

    const newGame = new this.gameModel({
      homeTeam: {
        team: homeTeam._id,
        name: homeTeam.name,
        logoUrl: homeTeam.logoUrl,
        players: lineUpHome,
      },
      awayTeam: {
        team: awayTeam._id,
        name: awayTeam.name,
        logoUrl: awayTeam.logoUrl,
        players: lineUpAway,
      },
      startDate: createGameDto.startDate,
    });

    return newGame.save();
  }

  async addEvent(event: GameEventDto, gameId: string) {
    const game = await this.gameModel.findById(gameId).lean();
    if (!game) {
      throw new NotFoundException(`Game ${gameId} not found`);
    }

    const teamSnapshot =
      event.team === GameSide.HOME ? game.homeTeam : game.awayTeam;
    const primaryPlayerId = this.resolvePlayerFromLineUpId(
      teamSnapshot,
      event.primaryPlayerId,
    );
    const secondaryPlayerId = this.resolvePlayerFromLineUpId(
      teamSnapshot,
      event.secondaryPlayerId,
    );

    if (event.type === GameEventType.GOAL && !primaryPlayerId) {
      throw new BadRequestException(
        "primaryPlayerId is required for GOAL events",
      );
    }

    const createdEvent: GameEvent = {
      minute: event.minute,
      minuteExtra: event.minuteExtra ?? 0,
      type: event.type,
      team: event.team ?? null,
      primaryPlayerId,
      secondaryPlayerId,
      timeStamp: new Date(),
    };

    await this.gameModel.findByIdAndUpdate(
      gameId,
      { $push: { events: event } },
      { new: true },
    );

    return createdEvent;
  }

  private async validateTeam(teamId: string): Promise<TeamDocument> {
    const team = await this.teamService.findById(teamId);

    if (!team) {
      throw new NotFoundException(`Team with id ${teamId} not found`);
    }

    return team;
  }

  private validatePlayersOfTeam(
    team: TeamDocument,
    playerIds: string[],
  ): Player[] {
    const validPlayerIds = team.players
      .map((p) => p as PlayerDocument)
      .map((p) => p.id);

    const nonValidPlayers = playerIds.filter(
      (p) => !validPlayerIds.includes(p),
    );

    if (nonValidPlayers.length > 0) {
      throw new NotFoundException(
        `Players with id ${nonValidPlayers.join(", ")} not valid`,
      );
    }

    const players = team.players
      .map((p) => p as PlayerDocument)
      .filter((p) => playerIds.includes(p.id));

    if (players.length < 1) {
      throw new BadRequestException(
        `Lineup of Teams with id ${team.id} must at least contain one player`,
      );
    }

    return players;
  }

  private resolvePlayerFromLineUpId(
    team: GameTeam,
    playerId: string | undefined,
  ): Types.ObjectId | undefined {
    if (!playerId) return undefined;

    const objectId = new Types.ObjectId(playerId);
    const isInLineup = team.players
      .map((p) => p as PlayerDocument)
      .some((p) => p._id.equals(objectId));

    if (!isInLineup) {
      throw new BadRequestException(
        `Player ${playerId} is not part of the selected team's lineup`,
      );
    }

    return objectId;
  }

  private totalMinute(event: GameEvent): number {
    return event.minute + (event.minuteExtra ?? 0) / 100;
  }
}
