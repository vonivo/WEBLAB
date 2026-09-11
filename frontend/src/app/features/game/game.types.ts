import { Player, Team } from '../../core/types/team.types';

export interface CreateGame {
  homeTeamId: string;
  awayTeamId: string;
  startDate: Date;
  lineupHomeTeam: string[];
  lineupAwayTeam: string[];
}

export interface Game {
  _id: string;
  homeTeam: GameTeam;
  awayTeam: GameTeam;
  startDate: Date;
  events: GameEvent[];
}

export interface GameTeam {
  team: string;
  name: string;
  logoUrl: string;
  players: Player[];
}

export interface GameEvent {
  _id?: string;
  minute: number;
  minuteExtra?: number;
  type: GameEventType;
  team?: GameSide;
  primaryPlayerId?: string;
  secondaryPlayerId?: string;
  timeStamp?: string;
}

export enum GameSide {
  HOME = 'HOME',
  AWAY = 'AWAY',
}

export enum GameEventType {
  GOAL = 'GOAL',
  HALF_TIME = 'HALF_TIME',
  PERIOD_END = 'PERIOD_END',
  PERIOD_START = 'PERIOD_START',
  KICKOFF = 'KICKOFF',
  GAME_END = 'GAME_END',
  OVERTIME_START = 'OVERTIME_START',
}
