import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameDetail } from './game-detail';
import { inputBinding, signal } from '@angular/core';
import { vi } from 'vitest';
import { GameApi } from '../../service/game.api';
import { By } from '@angular/platform-browser';
import { GameDetailView } from '../../dumb_components/game-detail-view/game-detail-view';
import { Game } from '../../game.types';
import { provideTranslateService } from '@ngx-translate/core';

describe('GameDetail', () => {
  it('should create', async () => {
    const { component } = await setup();
    expect(component).toBeTruthy();
  });

  it('should render game-detail-view', async () => {
    const { fixture } = await setup();

    const detailView = fixture.debugElement.query(By.directive(GameDetailView));
    expect(detailView).toBeTruthy();
  });

  it('should set the gameId in the api service', async () => {
    const { gameApiMock } = await setup();

    expect(gameApiMock.setGameId).toHaveBeenCalledExactlyOnceWith('gameId');
  });
});

const game: Game = {
  _id: 'gameId',
  homeTeam: {
    name: 'Team A',
    team: 'teamAid',
    players: [],
    logoUrl: 'logoA.png',
  },
  awayTeam: {
    name: 'Team B',
    team: 'teamBid',
    players: [],
    logoUrl: 'logoB.png',
  },
  events: [],
  startDate: new Date(),
};

async function setup() {
  const gameApiMock = {
    getGameResource: vi.fn(),
    setGameId: vi.fn(),
  };

  const gameResourceMock = {
    value: vi.fn(),
  };

  gameResourceMock.value.mockReturnValue(game);

  gameApiMock.getGameResource.mockReturnValue(gameResourceMock);
  await TestBed.configureTestingModule({
    imports: [GameDetail],
    providers: [provideTranslateService(), { provide: GameApi, useValue: gameApiMock }],
  }).compileComponents();

  const fixture = TestBed.createComponent(GameDetail, {
    bindings: [inputBinding('gameId', signal('gameId'))],
  });
  const component = fixture.componentInstance;
  fixture.detectChanges();
  await fixture.whenStable();

  return {
    component,
    fixture,
    gameApiMock,
  };
}
