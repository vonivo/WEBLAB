import { Component, effect, input, output, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Player, Team } from '../../team.types';
import { MatDivider } from '@angular/material/list';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatCard } from '@angular/material/card';
import { TranslatePipe } from '@ngx-translate/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { applyEach, form, FormField, required } from '@angular/forms/signals';
import { FormsModule } from '@angular/forms';
import { SkeletonLoader } from '../../../../components/skeleton/skeleton-loader';
import { NgTemplateOutlet } from '@angular/common';

interface EditTeamData {
  name: string;
  logoUrl: string;
  players: Player[];
}

@Component({
  imports: [
    MatIcon,
    MatDivider,
    MatError,
    MatLabel,
    MatFormField,
    MatCard,
    MatInput,
    TranslatePipe,
    MatButton,
    FormField,
    MatIconButton,
    FormsModule,
    SkeletonLoader,
    NgTemplateOutlet,
  ],
  selector: 'app-team-detail-edit',
  styleUrl: './team-detail-edit.css',
  templateUrl: './team-detail-edit.html',
})
export class TeamDetailEdit {
  readonly team = input.required<Team>();
  readonly isLoading = input.required<boolean>();
  readonly teamSaved = output<Team>();

  readonly editTeamModel = signal<EditTeamData>({
    name: '',
    logoUrl: '',
    players: [],
  });

  readonly editTeamForm = form(this.editTeamModel, (schemaPath) => {
    required(schemaPath.name, { message: 'generic.required' });
    required(schemaPath.logoUrl, { message: 'generic.required' });
    applyEach(schemaPath.players, (playerPath) => {
      required(playerPath.firstname, { message: 'generic.required' });
      required(playerPath.lastname, { message: 'generic.required' });
    });
  });

  constructor() {
    effect(() => {
      this.setTeam(this.team());
    });
  }

  save(event: Event): void {
    event.preventDefault();
    if (this.editTeamForm().valid()) {
      const team = {
        _id: this.team()._id,
        name: this.editTeamModel().name,
        logoUrl: this.editTeamModel().logoUrl,
        players: this.editTeamModel().players,
      } as Team;
      this.teamSaved.emit(team);
      this.editTeamForm().reset();
    }
  }

  cancel(): void {
    this.editTeamForm().reset();
    this.setTeam(this.team());
  }

  addPlayer(): void {
    const players = [...this.editTeamModel().players];
    players.push({
      firstname: '',
      lastname: '',
    });

    this.editTeamForm.players().value.set(players);
  }

  removePlayer(index: number): void {
    const players = [...this.editTeamModel().players];
    players.splice(index, 1);
    this.editTeamForm.players().value.set(players);
    this.editTeamForm.players().markAsTouched();
  }

  private setTeam(team: Team): void {
    this.editTeamForm.name().value.set(team.name);
    this.editTeamForm.logoUrl().value.set(team.logoUrl);
    this.editTeamForm.players().value.set(team.players);
  }
}
