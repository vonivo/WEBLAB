export interface Team {
  _id: string;
  name: string;
  logoUrl: string;
  players: Player[];
}

export interface CreatedTeam {
  name: string;
  logoUrl: string;
}

export interface Player {
  firstname: string;
  lastname: string;
}
