import { Component, input } from '@angular/core';
import { Game } from '../../game.types';
import { MatCard, MatCardContent } from '@angular/material/card';
import { RouterLink } from '@angular/router';

@Component({
  imports: [MatCard, MatCardContent, RouterLink],
  selector: 'app-game-list-entry',
  styleUrl: './game-list-entry.css',
  templateUrl: './game-list-entry.html',
})
export class GameListEntry {
  game = input.required<Game>();
}
