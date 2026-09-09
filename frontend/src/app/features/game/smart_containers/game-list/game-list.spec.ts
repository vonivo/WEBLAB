import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameList } from './game-list';
import { vi } from 'vitest';
import { GameApi } from '../../service/game.api';
import { By } from '@angular/platform-browser';
import { GameListEntry } from '../../dumb_components/game-list-entry/game-list-entry';

describe('GameList', () => {
  let component: GameList;
  let fixture: ComponentFixture<GameList>;

  beforeEach(async () => {});

  it('should create', async () => {
    const { component } = await setup();
    expect(component).toBeTruthy();
  });

  it('should render entry', async () => {
    const { fixture } = await setup();
    const entry = fixture.debugElement.query(By.directive(GameListEntry));
    expect(entry).toBeTruthy();
  });
});

async function setup() {
  const gamesResource = {
    value: vi.fn(),
  };

  gamesResource.value.mockReturnValue([
    {
      homeTeam: {
        name: 'team A',
        logoUrl: 'teama.png',
      },
      awayTeam: {
        name: 'team B',
        logoUrl: 'teamb.png',
      },
    },
  ]);

  const gameApiMock = {
    getGamesResource: vi.fn(),
  };

  gameApiMock.getGamesResource.mockReturnValue(gamesResource);

  await TestBed.configureTestingModule({
    imports: [GameList],
    providers: [{ provide: GameApi, useValue: gameApiMock }],
  }).compileComponents();

  const fixture = TestBed.createComponent(GameList);
  const component = fixture.componentInstance;
  fixture.detectChanges();
  await fixture.whenStable();

  return {
    component,
    fixture,
  };
}
