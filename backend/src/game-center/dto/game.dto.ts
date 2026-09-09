export interface CreateGameDto {
  homeTeamId: string;
  awayTeamId: string;
  startDate: Date;
  lineupHomeTeam: string[];
  lineupAwayTeam: string[];
}
