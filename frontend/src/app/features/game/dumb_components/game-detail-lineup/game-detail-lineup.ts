import { Component, computed, input } from '@angular/core';
import { Game } from '../../game.types';

@Component({
  imports: [],
  selector: 'app-game-detail-lineup',
  styleUrl: './game-detail-lineup.css',
  templateUrl: './game-detail-lineup.html',
})
export class GameDetailLineup {
  game = input.required<Game>();
  teams = computed(() => [this.game().homeTeam, this.game().awayTeam]);
}
