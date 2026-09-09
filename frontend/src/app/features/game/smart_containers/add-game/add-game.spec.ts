import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { describe, expect, it, beforeEach, vi } from 'vitest';

import { AddGame } from './add-game';
import { AddGameForm } from '../../dumb_components/add-game-form/add-game-form';
import { TeamApi } from '../../../../core/services/team.api';
import { GameApi } from '../../service/game.api';
import { CreateGame, Game } from '../../game.types';
import { provideTranslateService } from '@ngx-translate/core';
import { Team } from '../../../../core/types/team.types';

describe('AddGame', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
  });

  it('should reload teams on init', async () => {
    const { fixture, teamsResource } = await setup();
    fixture.detectChanges();

    expect(teamsResource.reload).toHaveBeenCalled();
  });

  it('should pass teams to the add game form', async () => {
    const { fixture, teamsResource } = await setup();

    const teams = [
      { _id: '1', name: 'Chudley Cannons' },
      { _id: '2', name: 'Tutshill Tornados' },
      { _id: '3', name: 'Appleby Arrows' },
    ];

    teamsResource.value.mockReturnValue(teams);

    fixture.detectChanges();

    const form = fixture.debugElement.query(By.directive(AddGameForm));

    expect(form.componentInstance.teams()).toEqual(teams);
  });

  it('should create a game when the form emits gameCreated', async () => {
    const { fixture, gameApiMock } = await setup();
    const createdGame = {
      _id: 'game-1',
    } as Game;

    const createGame = {
      homeTeamId: '1',
      awayTeamId: '2',
    } as CreateGame;

    gameApiMock.createGame.mockReturnValue(of(createdGame));

    fixture.detectChanges();

    const form = fixture.debugElement.query(By.directive(AddGameForm));

    form.triggerEventHandler('onGameCreated', createGame);

    expect(gameApiMock.createGame).toHaveBeenCalled();
  });

  it('should reload games and emit the created game after creating a game', async () => {
    const { component, gameApiMock, gamesResource } = await setup();
    const createGame = {
      homeTeamId: '1',
      awayTeamId: '2',
    } as CreateGame;

    const createdGame = {
      _id: 'game-1',
    } as Game;

    gameApiMock.createGame.mockReturnValue(of(createdGame));

    const emitSpy = vi.spyOn(component.onGameCreated, 'emit');

    component.handleGameCreated(createGame);

    expect(gameApiMock.getGamesResource).toHaveBeenCalled();
    expect(gamesResource.reload).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith(createdGame);
  });

  it('should emit onCancelClick when the form is cancelled', async () => {
    const { component, fixture } = await setup();

    fixture.detectChanges();

    vi.spyOn(component.onCancelClick, 'emit');

    const form = fixture.debugElement.query(By.css('app-add-game-form'));

    form.triggerEventHandler('onCancelClick');

    expect(component.onCancelClick.emit).toHaveBeenCalled();
  });
});

async function setup() {
  const teamsResource = {
    reload: vi.fn(),
    value: vi.fn(),
  };
  teamsResource.value.mockReturnValue([]);

  const gamesResource = {
    reload: vi.fn(),
  };

  const teamApiMock = {
    getTeamsResource: vi.fn(() => teamsResource),
  };

  const gameApiMock = {
    createGame: vi.fn(),
    getGamesResource: vi.fn(() => gamesResource),
  };

  await TestBed.configureTestingModule({
    imports: [AddGame],
    providers: [
      provideTranslateService(),
      {
        provide: TeamApi,
        useValue: teamApiMock,
      },
      {
        provide: GameApi,
        useValue: gameApiMock,
      },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(AddGame);
  const component = fixture.componentInstance;
  fixture.detectChanges();
  await fixture.whenStable();

  return {
    component,
    fixture,
    teamsResource,
    teamApiMock,
    gamesResource,
    gameApiMock,
  };
}
