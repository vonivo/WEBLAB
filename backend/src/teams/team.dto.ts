export interface TeamDto {
  name: string;
  logoUrl: string;
  players: PlayerDto[];
}

export interface PlayerDto {
  firstname: string;
  lastname: string;
}

export interface UpdateTeamDto {
  name: string;
  logoUrl: string;
  players: PlayerDto[];
}
