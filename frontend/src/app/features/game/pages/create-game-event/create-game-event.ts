import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { AddGameEvent } from '../../smart_containers/add-game-event/add-game-event';
import { Game } from '../../game.types';

@Component({
  imports: [AddGameEvent],
  selector: 'app-create-game-event',
  styleUrl: './create-game-event.css',
  templateUrl: './create-game-event.html',
})
export class CreateGameEvent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly routeParams = toSignal(this.route.paramMap, { requireSync: true });
  readonly gameId = computed(() => this.routeParams().get('gameId') ?? '');

  handleFormSubmit() {
    this.router.navigate(['/games', this.gameId()]);
  }
}
