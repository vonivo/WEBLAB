import { inject, Injectable } from '@angular/core';
import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { Team } from '../../team.types';

@Injectable({
  providedIn: 'root',
})
export class TeamApi {
  http = inject(HttpClient);
  getTeams() {
    return httpResource<Team[]>(() => `/api/teams`);
  }

  createTeam(team: Team) {
    return this.http.post<Team>('/api/teams', team);
  }
}
