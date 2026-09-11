import { Component, computed, inject } from '@angular/core';
import { GameApi } from '../../service/game.api';
import { Game, GameEventType, GameSide } from '../../game.types';
import { GameDetailHeader } from '../../dumb_components/game-detail-header/game-detail-header';
import { RouterLink } from '@angular/router';
import { GameListEntry } from '../../dumb_components/game-list-entry/game-list-entry';
import { TranslatePipe } from '@ngx-translate/core';
import { GameService } from '../../service/game.service';

@Component({
  imports: [GameDetailHeader, RouterLink, GameListEntry, TranslatePipe],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {
  readonly gameService = inject(GameService);
  private readonly gameApi = inject(GameApi);

  gamesResource = this.gameApi.getGamesResource();

  liveGame = computed(() => {
    const games = this.gamesResource.value();
    if (games) {
      return this.getFirstLiveGame(games);
    }
    return null;
  });

  upcomingGames = computed(() => {
    const games = this.gamesResource.value();
    if (games) {
      return this.getUpcomingGames(games);
    }
    return [];
  });

  private getUpcomingGames(games: Game[]) {
    return games.filter((g) => {
      const hasStarted = g.events.map((e) => e.type).some((t) => t === GameEventType.KICKOFF);
      const hasEnded = g.events.map((e) => e.type).some((t) => t === GameEventType.GAME_END);

      return !hasStarted && !hasEnded;
    });
  }

  private getFirstLiveGame(games: Game[]) {
    const liveGames = games.filter((g) => {
      const hasStarted = g.events.map((e) => e.type).some((t) => t === GameEventType.KICKOFF);
      const hasEnded = g.events.map((e) => e.type).some((t) => t === GameEventType.GAME_END);

      return hasStarted && !hasEnded;
    });

    if (liveGames.length > 0) {
      return liveGames[0];
    }
    return null;
  }

  protected readonly GameSide = GameSide;
}
