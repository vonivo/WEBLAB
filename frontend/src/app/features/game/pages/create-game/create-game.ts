import { Component, inject } from '@angular/core';
import { AddGame } from '../../smart_containers/add-game/add-game';
import { Game } from '../../game.types';
import { Router } from '@angular/router';

@Component({
  imports: [AddGame],
  selector: 'app-create-game',
  styleUrl: './create-game.css',
  templateUrl: './create-game.html',
})
export class CreateGame {
  private readonly router = inject(Router);

  handleGameCreated(game: Game) {
    this.router.navigate(['/games', game._id]);
  }

  handleCancel() {
    this.router.navigate(['/games']);
  }
}
