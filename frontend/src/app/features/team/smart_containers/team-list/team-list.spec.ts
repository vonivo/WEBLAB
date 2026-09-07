import { TestBed } from '@angular/core/testing';
import { DialogAddTeam, TeamList } from './team-list';
import { TeamApi } from '../../services/api/team.api';
import { provideTranslateService } from '@ngx-translate/core';
import { Team } from '../../team.types';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

describe('TeamList', () => {
  it('should create', async () => {
    const { component } = await setup();
    expect(component).toBeTruthy();
  });

  it('should render received teams', async () => {
    const { fixture } = await setup();

    const teams = fixture.debugElement.queryAll(By.css('app-team-list-entry'));
    expect(teams.length).toEqual(defaultProps.teams.length);
  });

  it('should render skeleton if loading', async () => {
    const { fixture } = await setup({ isLoading: true, teams: undefined });

    const skeletonLoaders = fixture.debugElement.queryAll(By.css('app-skeleton-loader'));
    expect(skeletonLoaders.length).toBeGreaterThan(1);
  });

  it('should handle if team was created', async () => {
    const { component, fixture, teamApiMock } = await setup();
    vi.spyOn(component.teamsResource, 'reload');

    const addTeamComponent = fixture.debugElement.query(By.css('app-add-team'));
    const addedTeam: Team = { name: 'createdTeam', logoUrl: 'anyLogo' };
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

const defaultProps: Props = {
  teams: [
    {
      name: 'Team A',
      logoUrl: 'https://somelogo.example.com/logo.png',
    },
    {
      name: 'Team B',
      logoUrl: 'https://somelogo.example.com/logo.png',
    },
  ],
  isLoading: false,
  isError: false,
};

async function setup(props: Partial<Props> = {}) {
  const mergedProps = { ...defaultProps, ...props };
  const teamApiMock = {
    getTeams: vi.fn(),
    createTeam: vi.fn(),
    reload: vi.fn(),
  };
  teamApiMock.createTeam.mockReturnValue(of({}));

  teamApiMock.getTeams.mockReturnValue({
    value: () => mergedProps.teams,
    isLoading: () => mergedProps.isLoading,
    error: () => mergedProps.isError,
    reload: () => mergedProps.teams,
  });

  const dialog = {
    open: vi.fn(),
  };

  await TestBed.configureTestingModule({
    imports: [TeamList],
    providers: [
      provideTranslateService(),
      { provide: TeamApi, useValue: teamApiMock },
      { provide: MatDialog, useValue: dialog },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(TeamList);
  const component = fixture.componentInstance;
  fixture.detectChanges();

  return { component, fixture, teamApiMock, dialog };
}

interface Props {
  teams: Team[];
  isLoading: boolean;
  isError: boolean;
}
