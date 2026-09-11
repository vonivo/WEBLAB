import { Component, inject, input } from '@angular/core';
import { Game } from '../../game.types';
import { DatePipe, NgClass } from '@angular/common';
import { GameService } from '../../service/game.service';

@Component({
  imports: [NgClass, DatePipe],
  selector: 'app-game-detail-header',
  styleUrl: './game-detail-header.css',
  templateUrl: './game-detail-header.html',
})
export class GameDetailHeader {
  private readonly gameService = inject(GameService);

  game = input.required<Game>();

  homeScore = input.required<number>();
  awayScore = input.required<number>();
  isLive = input.required<boolean>();
  statusLabel = input.required<string>();
}
