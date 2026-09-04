import { Component, inject, model } from '@angular/core';
import { TeamApi } from '../../services/api/team.api';
import { TeamListEntry } from '../../dumb_components/team-list-entry/team-list-entry';
import { AddTeam } from '../../dumb_components/add-team/add-team';
import { Team } from '../../team.types';
import { MatFabButton } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

@Component({
  imports: [TeamListEntry, AddTeam, MatIcon, MatFabButton],
  selector: 'app-team-list',
  styleUrl: './team-list.css',
  templateUrl: './team-list.html',
})
export class TeamList {
  private readonly teamApi = inject(TeamApi);
  readonly dialog = inject(MatDialog);
  readonly createdTeamInDialog = model<Team>();

  teamsResource = this.teamApi.getTeams();

  handleTeamCreate(team: Team) {
    this.createTeam(team);
  }

  createTeam(team: Team) {
    this.teamApi.createTeam(team).subscribe(() => {
      this.teamsResource.reload();
    });
  }

  openCreateTeamDialog() {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog);

    dialogRef.afterClosed().subscribe((result: Team) => {
      if (result !== undefined) {
        this.createTeam(result);
      }
    });
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  template: '<app-add-team (onFormSubmit)="handleTeamCreate($event)"></app-add-team>',
  imports: [AddTeam],
})
export class DialogOverviewExampleDialog {
  readonly dialogRef = inject(MatDialogRef<DialogOverviewExampleDialog>);

  handleTeamCreate(team: Team) {
    this.dialogRef.close(team);
  }
}
