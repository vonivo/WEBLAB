import { Component, effect, inject, input } from '@angular/core';
import { GameDetailView } from '../../dumb_components/game-detail-view/game-detail-view';
import { GameApi } from '../../service/game.api';
import { GameService } from '../../service/game.service';
import { GameDetailHeader } from '../../dumb_components/game-detail-header/game-detail-header';
import { GameSide } from '../../game.types';

@Component({
  imports: [GameDetailView],
  selector: 'app-game-detail',
  styleUrl: './game-detail.css',
  templateUrl: './game-detail.html',
})
export class GameDetail {
  gameId = input.required<string>();

  private readonly gameApi = inject(GameApi);
  readonly gameService = inject(GameService);

  readonly game = this.gameApi.getGameResource();

  constructor() {
    effect(() => {
      this.gameApi.setGameId(this.gameId());
    });
  }

  protected readonly GameSide = GameSide;
}
