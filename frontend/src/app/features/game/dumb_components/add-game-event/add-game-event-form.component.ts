import { Component, input, output, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { Game, GameEvent, GameEventType, GameSide } from '../../game.types';
import { form, FormField, min, required } from '@angular/forms/signals';
import { Player } from '../../../../core/types/team.types';
import { MatButton } from '@angular/material/button';

interface GameEventData {
  type: GameEventType | null;
  minute: number;
  minuteExtra: number;
  side: GameSide | null;
  primaryPlayer: Player | null;
  secondaryPlayer: Player | null;
}

@Component({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TranslatePipe,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    MatInput,
    FormField,
    MatError,
    MatButton,
  ],
  selector: 'app-add-game-event-form',
  styleUrl: './add-game-event-form.component.css',
  templateUrl: './add-game-event-form.component.html',
})
export class AddGameEventForm {
  game = input.required<Game>();
  onCancel = output();
  onGameEventCreated = output<GameEvent>();

  readonly GameEventType = GameEventType;
  readonly eventTypes = Object.keys(GameEventType);
  readonly gameSides = Object.keys(GameSide);

  createEventModle = signal<GameEventData>({
    type: null,
    minute: 0,
    minuteExtra: 0,
    side: null,
    primaryPlayer: null,
    secondaryPlayer: null,
  });

  createEventForm = form(this.createEventModle, (schemaPath) => {
    required(schemaPath.minute, { message: 'generic.required' });
    min(schemaPath.minute, 0, { message: 'types.game.fields.events.errors.min' });
    min(schemaPath.minuteExtra, 0, { message: 'types.game.fields.events.errors.min' });
    required(schemaPath.type, { message: 'generic.required' });
    required(schemaPath.side, {
      message: 'generic.required',
      when: ({ valueOf }) => valueOf(schemaPath.type) === GameEventType.GOAL,
    });
    required(schemaPath.primaryPlayer, {
      message: 'generic.required',
      when: ({ valueOf }) => valueOf(schemaPath.type) === GameEventType.GOAL,
    });
  });

  getPlayerSelection() {
    if (this.createEventModle().side === GameSide.HOME) {
      return this.game().homeTeam.players;
    }

    return this.game().awayTeam.players;
  }

  handleSelectionChange() {
    this.createEventModle.set({
      ...this.createEventModle(),
      side: null,
      primaryPlayer: null,
      secondaryPlayer: null,
    });
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    this.createEventForm().markAsTouched();

    if (this.createEventForm().valid()) {
      const createdEvent = this.createEventModle();
      this.onGameEventCreated.emit({
        minute: createdEvent.minute,
        minuteExtra: createdEvent.minuteExtra,
        type: createdEvent.type!,
        team: createdEvent.side!,
        primaryPlayerId: createdEvent.primaryPlayer?._id,
        secondaryPlayerId: createdEvent.secondaryPlayer?._id,
      });
    }
  }

  handleCancelClick() {
    this.onCancel.emit();
  }
}
