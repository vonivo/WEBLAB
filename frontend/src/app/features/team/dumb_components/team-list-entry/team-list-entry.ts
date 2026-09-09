import { Component, input, output } from '@angular/core';
import { Team } from '../../../../core/types/team.types';
import { MatCard, MatCardAvatar, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

@Component({
  imports: [
    MatCard,
    MatCardAvatar,
    MatCardHeader,
    MatCardTitle,
    NgOptimizedImage,
    RouterLink,
    MatIcon,
    MatIconButton,
  ],
  selector: 'app-team-list-entry',
  styleUrl: './team-list-entry.css',
  templateUrl: './team-list-entry.html',
})
export class TeamListEntry {
  team = input.required<Team>();
  onTeamDeleted = output<Team>();

  getPlayerList(team: Team) {
    return team.players.map((p) => `${p.firstname} ${p.lastname}`).join(', ');
  }

  handleDeleteButtonClick(team: Team) {
    this.onTeamDeleted.emit(team);
  }
}
