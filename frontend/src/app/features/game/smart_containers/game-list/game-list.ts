import { Component, inject, OnInit } from '@angular/core';
import { Game } from '../../game.types';
import { GameApi } from '../../service/game.api';
import { GameListEntry } from '../../dumb_components/game-list-entry/game-list-entry';
import { SkeletonLoader } from '../../../../components/skeleton/skeleton-loader';

@Component({
  imports: [GameListEntry, SkeletonLoader],
  selector: 'app-game-list',
  styleUrl: './game-list.css',
  templateUrl: './game-list.html',
})
export class GameList implements OnInit {
  private readonly gameApi = inject(GameApi);

  gameResource = this.gameApi.getGamesResource();

  ngOnInit() {
    this.gameResource.reload();
  }
}
