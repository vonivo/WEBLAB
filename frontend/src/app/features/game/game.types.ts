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
}

export interface GameTeam {
  team: string;
  name: string;
  logoUrl: string;
  players: Player[];
}
