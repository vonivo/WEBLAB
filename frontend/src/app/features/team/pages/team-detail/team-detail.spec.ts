import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeamDetail } from './team-detail';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { Team } from '../../../../core/types/team.types';
import { TeamApi } from '../../../../core/services/team.api';
import { provideTranslateService } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';

describe('TeamDetail', () => {
  it('should create', async () => {
    const { component } = await setup();
    expect(component).toBeTruthy();
  });

  it('should handle team saved', async () => {
    const { component, fixture, teamApiMock } = await setup();
    vi.spyOn(component.team, 'reload');

    const editComp = fixture.debugElement.query(By.css('app-team-detail-edit'));
    editComp.triggerEventHandler('teamSaved', defaultProps.mockedTeam);

    expect(teamApiMock.updateTeam).toHaveBeenCalled();
    expect(component.team.reload).toHaveBeenCalled();
  });
});

const defaultProps: Props = {
  teamId: 'teamId',
  mockedTeam: {
    _id: 'teamId',
    name: 'Team Name',
    logoUrl: 'URL',
    players: [],
  },
  isLoading: false,
};

async function setup(props: Partial<Props> = {}) {
  const mergedProps = { ...defaultProps, ...props };
  const paramMap = convertToParamMap({ id: mergedProps.teamId });
  const params = new BehaviorSubject(paramMap);

  const teamApiMock = {
    getTeamById: vi.fn(),
    updateTeam: vi.fn(),
  };

  teamApiMock.updateTeam.mockReturnValue(of({}));

  teamApiMock.getTeamById.mockReturnValue({
    value: () => mergedProps.mockedTeam,
    isLoading: () => mergedProps.isLoading,
    reload: () => {},
  });

  await TestBed.configureTestingModule({
    imports: [TeamDetail],
    providers: [
      provideTranslateService(),
      { provide: TeamApi, useValue: teamApiMock },
      {
        provide: ActivatedRoute,
        useValue: {
          paramMap: params.asObservable(),
          snapshot: { paramMap },
        },
      },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(TeamDetail);
  const component = fixture.componentInstance;
  fixture.detectChanges();

  return {
    component,
    fixture,
    teamApiMock,
  };
}

interface Props {
  mockedTeam: Team;
  isLoading: boolean;
  teamId: string;
}
