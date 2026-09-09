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
  _id: string;
  firstname: string;
  lastname: string;
}

export interface CreatePlayer {
  firstname: string;
  lastname: string;
}
