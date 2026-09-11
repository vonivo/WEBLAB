import { Component, effect, inject, input, output } from '@angular/core';
import { GameApi } from '../../service/game.api';
import { ActivatedRoute } from '@angular/router';
import { GameEvent } from '../../game.types';
import { AddGameEventForm } from '../../dumb_components/add-game-event/add-game-event-form.component';

@Component({
  imports: [AddGameEventForm],
  selector: 'app-add-game-event',
  styleUrl: './add-game-event.css',
  templateUrl: './add-game-event.html',
})
export class AddGameEvent {
  private readonly gameApi = inject(GameApi);

  gameId = input.required<string>();
  onGameEventCreated = output<GameEvent>();
  onCancel = output();

  readonly gameResource = this.gameApi.getGameResource();

  constructor() {
    effect(() => {
      this.gameApi.setGameId(this.gameId());
    });
  }

  handleEventCreated(event: GameEvent) {
    this.gameApi.createGameEvent(this.gameId(), event).subscribe(() => {
      this.gameResource.reload();
      this.onGameEventCreated.emit(event);
    });
  }

  handleCancel() {
    this.onCancel.emit();
  }
}
