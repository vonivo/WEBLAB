import { Component, inject, model } from '@angular/core';
import { TeamList } from '../../smart_containers/team-list/team-list';
import { AddTeam } from '../../dumb_components/add-team/add-team';
import { Team, CreatedTeam } from '../../team.types';
import { MatIcon } from '@angular/material/icon';
import { TeamApi } from '../../services/api/team.api';
import { MatFabButton } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  imports: [TeamList, AddTeam, MatIcon, MatFabButton],
  selector: 'app-team-overview',
  styleUrl: './team-overview.css',
  templateUrl: './team-overview.html',
})
export class TeamOverview {
  private readonly teamApi = inject(TeamApi);
  readonly dialog = inject(MatDialog);
  readonly createdTeamInDialog = model<CreatedTeam>();

  readonly teamsResource = this.teamApi.getTeamsResource();

  handleTeamCreate(team: CreatedTeam) {
    this.createTeam(team);
  }

  createTeam(team: CreatedTeam) {
    this.teamApi.createTeam(team).subscribe(() => {
      this.teamsResource.reload();
    });
  }

  openCreateTeamDialog() {
    const dialogRef = this.dialog.open(DialogAddTeam);

    dialogRef.afterClosed().subscribe((result: Team) => {
      if (result !== undefined) {
        this.createTeam(result);
      }
    });
  }
}

@Component({
  selector: 'dialog-add-team',
  template: '<app-add-team (onFormSubmit)="handleTeamCreate($event)"></app-add-team>',
  imports: [AddTeam],
})
export class DialogAddTeam {
  readonly dialogRef = inject(MatDialogRef<DialogAddTeam>);

  handleTeamCreate(team: CreatedTeam) {
    this.dialogRef.close(team);
  }
}
