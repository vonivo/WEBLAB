import { TestBed } from '@angular/core/testing';
import { TeamList } from './team-list';
import { TeamApi } from '../../../../core/services/team.api';
import { provideTranslateService } from '@ngx-translate/core';
import { Team } from '../../../../core/types/team.types';
import { By } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

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

  it('should handle team deletion', async () => {
    const { component, fixture, teamApiMock } = await setup();
    vi.spyOn(component.teamsResource, 'reload');

    const teamEntries = fixture.debugElement.queryAll(By.css('app-team-list-entry'));
    const teamToDelete = defaultProps.teams[0];
    teamEntries[0].triggerEventHandler('onTeamDeleted', teamToDelete);

    expect(teamApiMock.delete).toHaveBeenCalledWith(teamToDelete._id);
    expect(component.teamsResource.reload).toHaveBeenCalled();
  });
});

const defaultProps: Props = {
  teams: [
    {
      _id: 'axe234a',
      name: 'Team A',
      logoUrl: 'https://somelogo.example.com/logo.png',
      players: [],
    },
    {
      _id: 'bce35a',
      name: 'Team B',
      logoUrl: 'https://somelogo.example.com/logo.png',
      players: [],
    },
  ],
  isLoading: false,
  isError: false,
};

async function setup(props: Partial<Props> = {}) {
  const mergedProps = { ...defaultProps, ...props };
  const teamApiMock = {
    getTeamsResource: vi.fn(),
    delete: vi.fn(),
  };

  teamApiMock.getTeamsResource.mockReturnValue({
    value: () => mergedProps.teams,
    isLoading: () => mergedProps.isLoading,
    error: () => mergedProps.isError,
    reload: () => mergedProps.teams,
  });

  teamApiMock.delete.mockReturnValue(of({}));

  const dialog = {
    open: vi.fn(),
  };

  await TestBed.configureTestingModule({
    imports: [TeamList],
    providers: [
      provideTranslateService(),
      { provide: TeamApi, useValue: teamApiMock },
      { provide: MatDialog, useValue: dialog },
      { provide: ActivatedRoute, useValue: {} },
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
