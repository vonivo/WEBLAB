import { Component, computed, inject, input } from '@angular/core';
import { Game, GameEventType, GameSide } from '../../game.types';
import { RouterLink } from '@angular/router';
import { DatePipe, NgClass } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { GameService } from '../../service/game.service';

@Component({
  imports: [RouterLink, DatePipe, NgClass],
  selector: 'app-game-list-entry',
  styleUrl: './game-list-entry.css',
  templateUrl: './game-list-entry.html',
})
export class GameListEntry {
  game = input.required<Game>();
  homeScore = input.required<number>();
  awayScore = input.required<number>();
  isLive = input.required<boolean>();
  statusLabel = input.required<string>();
  isUpcoming = input.required<boolean>();
}
