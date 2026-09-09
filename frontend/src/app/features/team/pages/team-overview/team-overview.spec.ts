import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeamOverview, DialogAddTeam } from './team-overview';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { CreatedTeam, Team } from '../../../../core/types/team.types';
import { provideTranslateService } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { TeamApi } from '../../../../core/services/team.api';

describe('TeamOverview', () => {
  it('should create', async () => {
    const { component } = await setup();
    expect(component).toBeTruthy();
  });

  it('should handle if team was created', async () => {
    const { component, fixture, teamApiMock } = await setup();
    vi.spyOn(component.teamsResource, 'reload');

    const addTeamComponent = fixture.debugElement.query(By.css('app-add-team'));
    const addedTeam: CreatedTeam = { name: 'createdTeam', logoUrl: 'anyLogo' };
    addTeamComponent.triggerEventHandler('onFormSubmit', addedTeam);

    expect(teamApiMock.createTeam).toHaveBeenCalled();
    expect(component.teamsResource.reload).toHaveBeenCalled();
  });

  it('should open the create team dialog', async () => {
    const { component, dialog } = await setup();
    const dialogRef = { afterClosed: vi.fn().mockReturnValue(of(undefined)) };

    dialog.open.mockReturnValue(dialogRef);
    component.openCreateTeamDialog();

    expect(dialog.open).toHaveBeenCalledWith(DialogAddTeam);
  });

  it('should create the team when the dialog returns a team', async () => {
    const { component, dialog } = await setup();
    const team = { name: 'Test Team', logoUrl: '' } as Team;
    const dialogRef = { afterClosed: vi.fn().mockReturnValue(of(team)) };
    const createTeamSpy = vi.spyOn(component, 'createTeam');

    dialog.open.mockReturnValue(dialogRef);
    component.openCreateTeamDialog();

    expect(createTeamSpy).toHaveBeenCalledWith(team);
  });

  it('should not create a team when the dialog is closed without a result', async () => {
    const { component, dialog } = await setup();
    const dialogRef = { afterClosed: vi.fn().mockReturnValue(of(undefined)) };
    dialog.open.mockReturnValue(dialogRef);
    const createTeamSpy = vi.spyOn(component, 'createTeam');

    component.openCreateTeamDialog();

    expect(createTeamSpy).not.toHaveBeenCalled();
  });
});

async function setup() {
  const teamApiMock = {
    getTeamsResource: vi.fn(),
    createTeam: vi.fn(),
    reload: vi.fn(),
  };
  teamApiMock.createTeam.mockReturnValue(of({}));
  teamApiMock.getTeamsResource.mockReturnValue({
    value: () => [],
    isLoading: () => false,
    error: () => true,
    reload: () => [],
  });

  const dialog = {
    open: vi.fn(),
  };

  await TestBed.configureTestingModule({
    imports: [TeamOverview],
    providers: [
      provideTranslateService(),
      { provide: TeamApi, useValue: teamApiMock },
      { provide: MatDialog, useValue: dialog },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(TeamOverview);
  const component = fixture.componentInstance;
  fixture.detectChanges();

  return {
    component,
    fixture,
    teamApiMock,
    dialog,
  };
}
