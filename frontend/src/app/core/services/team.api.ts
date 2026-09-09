import { inject, Injectable, Signal } from '@angular/core';
import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { Team, CreatedTeam } from '../types/team.types';

@Injectable({
  providedIn: 'root',
})
export class TeamApi {
  private readonly teamsResource = httpResource<Team[]>(() => '/api/teams');

  private readonly http = inject(HttpClient);

  getTeamsResource() {
    return this.teamsResource;
  }

  getTeamById(teamId: Signal<string>) {
    return httpResource<Team>(() => `/api/teams/${teamId()}`);
  }

  createTeam(team: CreatedTeam) {
    return this.http.post<CreatedTeam>('/api/teams', team);
  }

  updateTeam(team: Team) {
    return this.http.put<Team>(`/api/teams/${team._id}`, team);
  }

  delete(id: string) {
    return this.http.delete<Team>(`/api/teams/${id}`);
  }
}
