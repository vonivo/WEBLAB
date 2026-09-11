import { inject, Injectable, signal, Signal } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { CreateGame, Game, GameEvent } from '../game.types';
import { Team } from '../../../core/types/team.types';

@Injectable({
  providedIn: 'root',
})
export class GameApi {
  private readonly http = inject(HttpClient);

  private readonly gameId = signal<string | undefined>(undefined);

  private readonly gamesResource = httpResource<Game[]>(() => '/api/games');
  readonly gameResource = httpResource<Game>(() => {
    const id = this.gameId();
    if (!id) {
      return undefined;
    }
    return `/api/games/${id}`;
  });

  getGamesResource() {
    return this.gamesResource;
  }

  setGameId(id: string) {
    this.gameId.set(id);
  }

  getGameResource() {
    return this.gameResource;
  }

  createGame(game: CreateGame) {
    return this.http.post<Game>('/api/games', game);
  }

  createGameEvent(gameId: string, gameEvent: GameEvent) {
    return this.http.post<Game>(`/api/games/${gameId}/events`, gameEvent);
  }
}
