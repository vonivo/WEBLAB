import { TestBed } from '@angular/core/testing';
import { Home } from './home';
import { provideTranslateService } from '@ngx-translate/core';
import { GameApi } from '../../service/game.api';
import { Game, GameEventType } from '../../game.types';
import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';
import { GameDetailHeader } from '../../dumb_components/game-detail-header/game-detail-header';
import { GameListEntry } from '../../dumb_components/game-list-entry/game-list-entry';

describe('Home', () => {
  it('should create', async () => {
    const { component } = await setup();
    expect(component).toBeTruthy();
  });

  it('should select one live game', async () => {
    const { component } = await setup();

    expect(component.liveGame()?._id).toBe('liveGame1');
  });

  it('should select only upcoming games', async () => {
    const { component } = await setup();

    const upcomingGameIds = component.upcomingGames().map((g) => g._id);

    expect(upcomingGameIds).toStrictEqual(['upcomingGame1', 'upcomingGame2']);
  });

  it('should render GameDetailHeader with the live Game as param', async () => {
    const { component, fixture } = await setup();

    const gameDetailHeader = fixture.debugElement.query(By.directive(GameDetailHeader));

    expect(gameDetailHeader).toBeTruthy();
    expect(gameDetailHeader.componentInstance.game()).toEqual(component.liveGame());
  });

  it('should render GameListEntries with the corresponding games as param', async () => {
    const { component, fixture } = await setup();

    const gameLisEntries = fixture.debugElement.queryAll(By.directive(GameListEntry));
    const upcomingGames = defaultProps.games.filter((g) => g._id.startsWith('upcomingGame'));

    upcomingGames.forEach((g, i) => {
      expect(gameLisEntries[i].componentInstance.game()).toBe(g);
    });
  });
});

const defaultProps: Props = {
  games: [
    {
      _id: 'upcomingGame1',
      startDate: new Date(),
      homeTeam: {
        team: 'teamAID',
        name: 'Team A',
        logoUrl: 'LogoTeamA.png',
        players: [],
      },
      awayTeam: {
        team: 'teamBID',
        name: 'Team B',
        logoUrl: 'LogoTeamB.png',
        players: [],
      },
      events: [],
    },
    {
      _id: 'liveGame1',
      startDate: new Date(),
      homeTeam: {
        team: 'teamAID',
        name: 'Team A',
        logoUrl: 'LogoTeamA.png',
        players: [],
      },
      awayTeam: {
        team: 'teamBID',
        name: 'Team B',
        logoUrl: 'LogoTeamB.png',
        players: [],
      },
      events: [
        {
          type: GameEventType.KICKOFF,
          minute: 0,
        },
      ],
    },
    {
      _id: 'liveGame2',
      startDate: new Date(),
      homeTeam: {
        team: 'teamAID',
        name: 'Team A',
        logoUrl: 'LogoTeamA.png',
        players: [],
      },
      awayTeam: {
        team: 'teamBID',
        name: 'Team B',
        logoUrl: 'LogoTeamB.png',
        players: [],
      },
      events: [
        {
          type: GameEventType.KICKOFF,
          minute: 0,
        },
      ],
    },
    {
      _id: 'upcomingGame2',
      startDate: new Date(),
      homeTeam: {
        team: 'teamAID',
        name: 'Team A',
        logoUrl: 'LogoTeamA.png',
        players: [],
      },
      awayTeam: {
        team: 'teamBID',
        name: 'Team B',
        logoUrl: 'LogoTeamB.png',
        players: [],
      },
      events: [],
    },
    {
      _id: 'finished',
      startDate: new Date(),
      homeTeam: {
        team: 'teamAID',
        name: 'Team A',
        logoUrl: 'LogoTeamA.png',
        players: [],
      },
      awayTeam: {
        team: 'teamBID',
        name: 'Team B',
        logoUrl: 'LogoTeamB.png',
        players: [],
      },
      events: [
        {
          type: GameEventType.KICKOFF,
          minute: 0,
        },
        {
          type: GameEventType.GAME_END,
          minute: 0,
        },
      ],
    },
  ],
};

async function setup() {
  const gameApiMock = {
    getGamesResource: vi.fn(),
  };
  const gamesResourceMock = {
    value: vi.fn(),
    reload: vi.fn(),
    isLoading: vi.fn(),
  };
  gameApiMock.getGamesResource.mockReturnValue(gamesResourceMock);
  gamesResourceMock.value.mockReturnValue(defaultProps.games);

  await TestBed.configureTestingModule({
    imports: [Home],
    providers: [
      provideTranslateService(),
      { provide: GameApi, useValue: gameApiMock },
      { provide: ActivatedRoute, useValue: {} },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(Home);
  const component = fixture.componentInstance;
  fixture.detectChanges();
  await fixture.whenStable();

  return {
    component,
    fixture,
  };
}

interface Props {
  games: Game[];
}
