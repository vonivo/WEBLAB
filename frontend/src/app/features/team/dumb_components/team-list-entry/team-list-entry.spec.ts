import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Team } from '../../team.types';
import { TeamListEntry } from './team-list-entry';
import { provideTranslateService } from '@ngx-translate/core';
import { inputBinding, signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

describe('TeamListEntry', () => {
  it('should create', async () => {
    const { component } = await setup();
    expect(component).toBeTruthy();
  });

  it('should render team name', async () => {
    const { fixture } = await setup();
    expect(fixture.nativeElement.textContent).toContain(defaultTeam.name);
  });

  it('should render team logo', async () => {
    const { fixture } = await setup();
    expect(fixture.debugElement.query(By.css('img')).nativeElement.src).toEqual(
      defaultTeam.logoUrl,
    );
  });
});

const defaultTeam: Team = {
  _id: 'axe234a',
  name: 'Team A',
  logoUrl: 'https://somelogo.example.com/logo.png',
  players: [],
};

async function setup() {
  await TestBed.configureTestingModule({
    imports: [TeamListEntry],
    providers: [provideTranslateService(), { provide: ActivatedRoute, useValue: {} }],
  }).compileComponents();

  const fixture = TestBed.createComponent(TeamListEntry, {
    bindings: [inputBinding('team', signal<Team>(defaultTeam))],
  });
  const component = fixture.componentInstance;
  fixture.detectChanges();

  return {
    component,
    fixture,
  };
}
