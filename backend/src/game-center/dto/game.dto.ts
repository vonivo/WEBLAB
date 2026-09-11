import { GameEventType, GameSide } from "../schema/game.schema.js";

export interface CreateGameDto {
  homeTeamId: string;
  awayTeamId: string;
  startDate: Date;
  lineupHomeTeam: string[];
  lineupAwayTeam: string[];
}

export interface GameEventDto {
  minute: number;
  minuteExtra?: number;
  type: GameEventType;
  team?: GameSide;
  primaryPlayerId?: string;
  secondaryPlayerId?: string;
}
