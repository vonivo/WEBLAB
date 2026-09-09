import { Component, computed, input, output, signal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOption, provideNativeDateAdapter } from '@angular/material/core';
import { Team } from '../../../../core/types/team.types';
import { form, FormField, required, validate } from '@angular/forms/signals';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDivider } from '@angular/material/list';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { MatCheckbox } from '@angular/material/checkbox';
import { TranslatePipe } from '@ngx-translate/core';
import { MatButton } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CreateGame } from '../../game.types';

interface PlayerSelection {
  playerId: string;
  selected: boolean;
}

interface CreateGameData {
  homeTeam: Team | null;
  awayTeam: Team | null;
  startDate: Date | null;
  lineUpHomeSelection: PlayerSelection[];
  lineUpAwaySelection: PlayerSelection[];
}

@Component({
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatDivider,
    MatSelect,
    MatOption,
    FormField,
    MatCheckbox,
    TranslatePipe,
    MatButton,
    FormsModule,
  ],
  selector: 'app-add-game-form',
  styleUrl: './add-game-form.css',
  templateUrl: './add-game-form.html',
  providers: [provideNativeDateAdapter()],
})
export class AddGameForm {
  teams = input.required<Team[]>();
  onGameCreated = output<CreateGame>();
  onCancelClick = output();

  createGameModel = signal<CreateGameData>({
    homeTeam: null,
    awayTeam: null,
    startDate: null,
    lineUpHomeSelection: [],
    lineUpAwaySelection: [],
  });
  createGameForm = form(this.createGameModel, (schemaPath) => {
    required(schemaPath.homeTeam, { message: 'generic.required' });
    required(schemaPath.awayTeam, { message: 'generic.required' });
    required(schemaPath.startDate, { message: 'generic.required' });
    validate(schemaPath.lineUpAwaySelection, (awayPlayerSelection) => {
      const hasAtLeastOneSelected = awayPlayerSelection.value().some((s) => s.selected);
      return hasAtLeastOneSelected
        ? null
        : { kind: 'minSelection', message: 'types.game.errors.lineMinSelection' };
    });
    validate(schemaPath.lineUpHomeSelection, (homePlayerSelection) => {
      const hasAtLeastOneSelected = homePlayerSelection.value().some((s) => s.selected);
      return hasAtLeastOneSelected
        ? null
        : { kind: 'minSelection', message: 'types.game.errors.lineMinSelection' };
    });
  });

  lineUpAway = computed(() => {
    const model = this.createGameModel();
    const selected = model.lineUpAwaySelection;
    return (model.awayTeam?.players ?? []).filter((p, i) => selected[i].selected);
  });

  lineUpHome = computed(() => {
    const model = this.createGameModel();
    const selected = model.lineUpHomeSelection;
    return (model.homeTeam?.players ?? []).filter((p, i) => selected[i].selected);
  });

  onAwayTeamSelected(changeEvent: MatSelectChange) {
    const team = changeEvent.value as Team;

    this.createGameForm.lineUpAwaySelection().value.set(
      (team.players ?? []).map((p) => ({
        playerId: p._id,
        selected: false,
      })),
    );
  }

  onHomeTeamSelected(changeEvent: MatSelectChange) {
    const team = changeEvent.value as Team;

    this.createGameForm.lineUpHomeSelection().value.set(
      (team.players ?? []).map((p) => ({
        playerId: p._id,
        selected: false,
      })),
    );
  }

  homeTeamOptions(): Team[] {
    return this.teams().filter(
      (t) => !this.createGameModel().awayTeam || this.createGameModel().awayTeam?._id !== t._id,
    );
  }

  awayTeamOptions(): Team[] {
    return this.teams().filter(
      (t) => !this.createGameModel().homeTeam || this.createGameModel().homeTeam?._id !== t._id,
    );
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.createGameForm().markAsTouched();

    if (this.createGameForm().valid()) {
      const createdGame: CreateGame = {
        homeTeamId: this.createGameModel().homeTeam!._id,
        awayTeamId: this.createGameModel().awayTeam!._id,
        startDate: this.createGameModel().startDate!,
        lineupHomeTeam: this.lineUpHome().map((p) => p._id),
        lineupAwayTeam: this.lineUpAway().map((p) => p._id),
      };
      this.onGameCreated.emit(createdGame);
    }
  }

  handleCancelClick() {
    this.createGameForm().reset({
      homeTeam: null,
      awayTeam: null,
      startDate: null,
      lineUpHomeSelection: [],
      lineUpAwaySelection: [],
    });
    this.onCancelClick.emit();
  }
}
