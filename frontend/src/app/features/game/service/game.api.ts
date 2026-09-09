import { inject, Injectable } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { CreateGame, Game } from '../game.types';

@Injectable({
  providedIn: 'root',
})
export class GameApi {
  private readonly http = inject(HttpClient);

  private readonly teamsResource = httpResource<Game[]>(() => '/api/games');

  getGamesResource() {
    return this.teamsResource;
  }

  createGame(game: CreateGame) {
    return this.http.post<Game>('/api/games', game);
  }
}
