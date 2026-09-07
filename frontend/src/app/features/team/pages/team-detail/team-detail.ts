import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TeamApi } from '../../services/api/team.api';
import { toSignal } from '@angular/core/rxjs-interop';
import { TeamDetailEdit } from '../../dumb_components/team-detail-edit/team-detail-edit';
import { Team } from '../../team.types';

@Component({
  imports: [TeamDetailEdit],
  selector: 'app-team-detail',
  styleUrl: './team-detail.css',
  templateUrl: './team-detail.html',
})
export class TeamDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly teamApi = inject(TeamApi);

  private readonly routeParams = toSignal(this.route.paramMap, { requireSync: true });

  readonly teamId = computed(() => this.routeParams().get('teamId') ?? '');

  readonly team = this.teamApi.getTeamById(this.teamId);

  handleTeamSaved(team: Team) {
    this.teamApi.updateTeam(team).subscribe(() => {
      this.team.reload();
    });
  }
}
