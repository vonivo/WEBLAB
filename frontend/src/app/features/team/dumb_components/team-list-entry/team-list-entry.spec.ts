import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeamListEntry } from './team-list-entry';
import { Team } from '../../team.types';
import { provideTranslateService } from '@ngx-translate/core';
import { inputBinding, signal } from '@angular/core';

describe('TeamListEntry', () => {
  let component: TeamListEntry;
  let fixture: ComponentFixture<TeamListEntry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamListEntry],
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(TeamListEntry, {
      bindings: [inputBinding('team', signal<Team>({ name: 'team1', logoUrl: 'logo.png' }))],
    });
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
