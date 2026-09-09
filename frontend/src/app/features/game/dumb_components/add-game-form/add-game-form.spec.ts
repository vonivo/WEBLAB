import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddGameForm } from './add-game-form';
import { inputBinding, signal } from '@angular/core';
import { Team } from '../../../../core/types/team.types';
import { provideTranslateService } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { MatSelectChange } from '@angular/material/select';

describe('AddGameForm', () => {
  it('should create', async () => {
    const { component } = await setUp();
    expect(component).toBeTruthy();
  });

  it('should render the team names in the select options', async () => {
    const { fixture } = await setUp();

    const homeTeamSelect = fixture.debugElement.query(
      By.css('[data-testid="ADD_GAME_SELECT_HOME_TEAM"]'),
    );
    const awayTeamSelect = fixture.debugElement.query(
      By.css('[data-testid=ADD_GAME_SELECT_AWAY_TEAM]'),
    );

    homeTeamSelect.nativeElement.click();
    awayTeamSelect.nativeElement.click();

    fixture.detectChanges();
    await fixture.whenStable();
    const homeTeamSelectOptions = fixture.debugElement.queryAll(
      By.css('[data-testid^="ADD_GAME_OPTION_HOME_"]'),
    );
    const allHomeOptions = homeTeamSelectOptions.map((o) => o.nativeElement.textContent.trim());

    const awayTeamSelectOptions = fixture.debugElement.queryAll(
      By.css('[data-testid^="ADD_GAME_OPTION_AWAY_"]'),
    );
    const allAwayOptions = awayTeamSelectOptions.map((o) => o.nativeElement.textContent.trim());

    ['Chudley Cannons', 'Tutshill Tornados', 'Appleby Arrows'].forEach((t) => {
      expect(allHomeOptions).toContain(t);
      expect(allAwayOptions).toContain(t);
    });
  });

  it('should not allow the away team to be selected as the home team', async () => {
    const { component } = await setUp();
    component.createGameForm.awayTeam().value.set(teams[1]);
    const options = component.homeTeamOptions();
    expect(options.map((team) => team._id)).toStrictEqual(['home-team', 'other-team']);
  });

  it('should not allow the home team to be selected as the away team', async () => {
    const { component } = await setUp();
    component.createGameForm.homeTeam().value.set(teams[0]);
    const options = component.awayTeamOptions();
    expect(options.map((team) => team._id)).toStrictEqual(['away-team', 'other-team']);
  });

  it('should not render the home team option when already selected', async () => {
    const { component, fixture } = await setUp();
    component.createGameForm.homeTeam().value.set(teams[0]);
    component.onHomeTeamSelected({ value: teams[0] } as MatSelectChange);

    const awayTeamSelect = fixture.debugElement.query(
      By.css('[data-testid=ADD_GAME_SELECT_AWAY_TEAM]'),
    );
    awayTeamSelect.nativeElement.click();

    fixture.detectChanges();
    await fixture.whenStable();

    const awayTeamSelectOptions = fixture.debugElement.queryAll(
      By.css('[data-testid^="ADD_GAME_OPTION_AWAY_"]'),
    );
    const allAwayOptions = awayTeamSelectOptions.map((o) => o.nativeElement.textContent.trim());

    expect(allAwayOptions).toStrictEqual(['Tutshill Tornados', 'Appleby Arrows']);
  });

  it('should not render the away team option when already selected', async () => {
    const { component, fixture } = await setUp();
    component.createGameForm.awayTeam().value.set(teams[1]);
    component.onAwayTeamSelected({ value: teams[1] } as MatSelectChange);

    const homeTeamSelect = fixture.debugElement.query(
      By.css('[data-testid=ADD_GAME_SELECT_HOME_TEAM]'),
    );
    homeTeamSelect.nativeElement.click();

    fixture.detectChanges();
    await fixture.whenStable();

    const homeTeamSelectOptions = fixture.debugElement.queryAll(
      By.css('[data-testid^="ADD_GAME_OPTION_HOME_"]'),
    );
    const allHomeOptions = homeTeamSelectOptions.map((o) => o.nativeElement.textContent.trim());

    expect(allHomeOptions).toStrictEqual(['Chudley Cannons', 'Appleby Arrows']);
  });

  it('should populate the away lineup when an away team is selected', async () => {
    const { component } = await setUp();
    const event = { value: teams[1] } as MatSelectChange;
    component.onAwayTeamSelected(event);
    expect(component.createGameModel().lineUpAwaySelection).toStrictEqual([
      { playerId: 'away-player-1', selected: false },
      { playerId: 'away-player-2', selected: false },
    ]);
  });

  it('should populate the home lineup when a home team is selected', async () => {
    const { component } = await setUp();
    const event = { value: teams[0] } as MatSelectChange;
    component.onHomeTeamSelected(event);
    expect(component.createGameModel().lineUpHomeSelection).toStrictEqual([
      { playerId: 'home-player-1', selected: false },
      { playerId: 'home-player-2', selected: false },
    ]);
  });

  it('should render players after selecting a home team', async () => {
    const { component, fixture } = await setUp();
    component.createGameForm.homeTeam().value.set(teams[0]);
    component.onHomeTeamSelected({ value: teams[0] } as MatSelectChange);

    const homeTeamSelect = fixture.debugElement.query(
      By.css('[data-testid=ADD_GAME_SELECT_HOME_TEAM]'),
    );
    homeTeamSelect.nativeElement.click();

    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Harry Potter');
    expect(fixture.nativeElement.textContent).toContain('Ron Weasley');
  });

  it('should render players after selecting a away team', async () => {
    const { component, fixture } = await setUp();
    component.createGameForm.awayTeam().value.set(teams[1]);
    component.onAwayTeamSelected({ value: teams[1] } as MatSelectChange);

    const awayTeamSelect = fixture.debugElement.query(
      By.css('[data-testid=ADD_GAME_SELECT_AWAY_TEAM]'),
    );
    awayTeamSelect.nativeElement.click();

    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Draco Malfoy');
    expect(fixture.nativeElement.textContent).toContain('Cedric Diggory');
  });

  it('should return selected home players from lineUpHome', async () => {
    const { component } = await setUp();
    component.createGameModel.set({
      homeTeam: teams[0],
      awayTeam: null,
      startDate: null,
      lineUpHomeSelection: [
        { playerId: 'home-player-1', selected: true },
        { playerId: 'home-player-2', selected: false },
      ],
      lineUpAwaySelection: [],
    });
    expect(component.lineUpHome().map((player) => player._id)).toStrictEqual(['home-player-1']);
  });

  it('should return selected away players from lineUpAway', async () => {
    const { component } = await setUp();
    component.createGameModel.set({
      homeTeam: null,
      awayTeam: teams[1],
      startDate: null,
      lineUpHomeSelection: [],
      lineUpAwaySelection: [
        { playerId: 'away-player-1', selected: false },
        { playerId: 'away-player-2', selected: true },
      ],
    });
    expect(component.lineUpAway().map((player) => player._id)).toStrictEqual(['away-player-2']);
  });

  it('should emit the created game when the form is valid', async () => {
    const { component } = await setUp();
    vi.spyOn(component.onGameCreated, 'emit');

    const startDate = new Date(2026, 8, 20);
    component.createGameModel.set({
      homeTeam: teams[0],
      awayTeam: teams[1],
      startDate,
      lineUpHomeSelection: [
        { playerId: 'home-player-1', selected: true },
        { playerId: 'home-player-2', selected: false },
      ],
      lineUpAwaySelection: [
        { playerId: 'away-player-1', selected: false },
        { playerId: 'away-player-2', selected: true },
      ],
    });
    component.onSubmit(new Event('submit'));
    expect(component.onGameCreated.emit).toHaveBeenCalledExactlyOnceWith({
      homeTeamId: 'home-team',
      awayTeamId: 'away-team',
      startDate,
      lineupHomeTeam: ['home-player-1'],
      lineupAwayTeam: ['away-player-2'],
    });
  });

  it('should not emit a game when no player is selected', async () => {
    const { component } = await setUp();
    vi.spyOn(component.onGameCreated, 'emit');

    component.createGameModel.set({
      homeTeam: teams[0],
      awayTeam: teams[1],
      startDate: new Date(2026, 8, 20),
      lineUpHomeSelection: [
        { playerId: 'home-player-1', selected: false },
        { playerId: 'home-player-2', selected: false },
      ],
      lineUpAwaySelection: [
        { playerId: 'away-player-1', selected: false },
        { playerId: 'away-player-2', selected: false },
      ],
    });
    component.onSubmit(new Event('submit'));
    expect(component.onGameCreated.emit).not.toHaveBeenCalled();
  });

  it('should reset the form when cancel is clicked', async () => {
    const { component } = await setUp();
    component.createGameModel.set({
      homeTeam: teams[0],
      awayTeam: teams[1],
      startDate: new Date(2026, 8, 20),
      lineUpHomeSelection: [{ playerId: 'home-player-1', selected: true }],
      lineUpAwaySelection: [{ playerId: 'away-player-1', selected: true }],
    });
    component.handleCancelClick();
    expect(component.createGameModel()).toStrictEqual({
      homeTeam: null,
      awayTeam: null,
      startDate: null,
      lineUpHomeSelection: [],
      lineUpAwaySelection: [],
    });
  });

  it('should emit cancel when cancel is clicked', async () => {
    const { component } = await setUp();
    vi.spyOn(component.onCancelClick, 'emit');

    component.handleCancelClick();
    expect(component.onCancelClick.emit).toHaveBeenCalledOnce();
  });
});

const teams: Team[] = [
  {
    _id: 'home-team',
    name: 'Chudley Cannons',
    logoUrl: '',
    players: [
      { _id: 'home-player-1', firstname: 'Harry', lastname: 'Potter' },
      { _id: 'home-player-2', firstname: 'Ron', lastname: 'Weasley' },
    ],
  },
  {
    _id: 'away-team',
    name: 'Tutshill Tornados',
    logoUrl: '',
    players: [
      { _id: 'away-player-1', firstname: 'Draco', lastname: 'Malfoy' },
      { _id: 'away-player-2', firstname: 'Cedric', lastname: 'Diggory' },
    ],
  },
  {
    _id: 'other-team',
    name: 'Appleby Arrows',
    logoUrl: '',
    players: [
      { _id: 'away-player-1', firstname: 'Cho', lastname: 'Chang' },
      { _id: 'away-player-2', firstname: 'Vincent', lastname: 'Crabbe' },
    ],
  },
];

async function setUp() {
  await TestBed.configureTestingModule({
    imports: [AddGameForm],
    providers: [provideTranslateService()],
  }).compileComponents();

  const fixture: ComponentFixture<AddGameForm> = TestBed.createComponent(AddGameForm, {
    bindings: [inputBinding('teams', signal(teams))],
  });
  const component = fixture.componentInstance;
  fixture.detectChanges();
  await fixture.whenStable();

  return {
    component,
    fixture,
  };
}
