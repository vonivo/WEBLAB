import { Component, input } from '@angular/core';
import { Team } from '../../team.types';
import { MatCard, MatCardAvatar, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { NgOptimizedImage } from '@angular/common';

@Component({
  imports: [MatCard, MatCardAvatar, MatCardHeader, MatCardTitle, NgOptimizedImage],
  selector: 'app-team-list-entry',
  styleUrl: './team-list-entry.css',
  templateUrl: './team-list-entry.html',
})
export class TeamListEntry {
  team = input.required<Team>();
}
