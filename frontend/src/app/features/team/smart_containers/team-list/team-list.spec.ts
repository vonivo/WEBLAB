import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeamList } from './team-list';
import { TeamApi } from '../../services/api/team.api';
import { provideTranslateService } from '@ngx-translate/core';

describe('TeamList', () => {
  let component: TeamList;
  let fixture: ComponentFixture<TeamList>;

  const teamApiMock = {
    getTeams: vi.fn(),
    createTeam: vi.fn(),
  };

  beforeEach(async () => {
    teamApiMock.getTeams.mockReturnValue({
      value: () => [],
      isLoading: () => false,
      error: () => undefined,
    });

    await TestBed.configureTestingModule({
      imports: [TeamList],
      providers: [provideTranslateService(), { provide: TeamApi, useValue: teamApiMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(TeamList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
