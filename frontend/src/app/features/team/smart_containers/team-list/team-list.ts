import { Component, inject, model } from '@angular/core';
import { TeamApi } from '../../../../core/services/team.api';
import { TeamListEntry } from '../../dumb_components/team-list-entry/team-list-entry';
import { SkeletonLoader } from '../../../../components/skeleton/skeleton-loader';
import { Team } from '../../../../core/types/team.types';

@Component({
  imports: [TeamListEntry, SkeletonLoader],
  selector: 'app-team-list',
  styleUrl: './team-list.css',
  templateUrl: './team-list.html',
})
export class TeamList {
  private readonly teamApi = inject(TeamApi);

  teamsResource = this.teamApi.getTeamsResource();

  handleTeamDeleted(team: Team) {
    this.teamApi.delete(team._id).subscribe(() => this.teamsResource.reload());
  }
}
