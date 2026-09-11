import { Component, input } from '@angular/core';
import { Game } from '../../game.types';
import { TranslatePipe } from '@ngx-translate/core';
import { GameDetailHeader } from '../game-detail-header/game-detail-header';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { GameDetailTimeline } from '../game-detail-timeline/game-detail-timeline';
import { GameDetailLineup } from '../game-detail-lineup/game-detail-lineup';

@Component({
  imports: [
    GameDetailHeader,
    MatTabGroup,
    MatTab,
    TranslatePipe,
    GameDetailTimeline,
    GameDetailLineup,
  ],
  selector: 'app-game-detail-view',
  styleUrl: './game-detail-view.css',
  templateUrl: './game-detail-view.html',
})
export class GameDetailView {
  game = input.required<Game>();

  homeScore = input.required<number>();
  awayScore = input.required<number>();
  isLive = input.required<boolean>();
  statusLabel = input.required<string>();
}
