import { TestBed } from '@angular/core/testing';
import { GameListEntry } from './game-list-entry';
import { Game } from '../../game.types';
import { inputBinding, signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';

describe('GameListEntry', () => {
  it('should create', async () => {
    const { component } = await setUp();
    expect(component).toBeTruthy();
  });

  it('should render both team Names', async () => {
    const { fixture } = await setUp();
    expect(fixture.nativeElement.textContent).toContain('Chudley Cannons');
    expect(fixture.nativeElement.textContent).toContain('Tutshill Tornados');
  });

  it('should render both team logos', async () => {
    const { fixture } = await setUp();

    const images = fixture.debugElement.queryAll(By.css('img'));
    const imgSrc = images.map((i) => i.nativeElement.getAttribute('src'));

    expect(imgSrc).toStrictEqual(['Chudley_Cannons.png', 'Tutshill_Tornados.png']);
  });

  it('should render live indicator when live', async () => {
    const { fixture } = await setUp({ isLive: true });

    const liveIndicator = fixture.debugElement.query(
      By.css('[data-testid="GLE_gameid_LIVE_INDICATOR'),
    );

    expect(liveIndicator).toBeTruthy();
  });

  it('should not render live indicator when not live', async () => {
    const { fixture } = await setUp({ isLive: false });

    const liveIndicator = fixture.debugElement.query(
      By.css('[data-testid="GLE_gameid_LIVE_INDICATOR'),
    );

    expect(liveIndicator).toBeFalsy();
  });
});

const defaultProps: Props = {
  game: {
    _id: 'gameid',
    startDate: new Date(),
    homeTeam: {
      team: 'teamId',
      name: 'Chudley Cannons',
      logoUrl: 'Chudley_Cannons.png',
      players: [],
    },
    awayTeam: {
      name: 'Tutshill Tornados',
      team: 'teamId2',
      logoUrl: 'Tutshill_Tornados.png',
      players: [],
    },
    events: [],
  },
  isLive: false,
  gameStatus: '',
  homeScore: 0,
  awayScore: 0,
  isUpcoming: true,
};

async function setUp(props: Partial<Props> = {}) {
  const mergedProps = { ...defaultProps, ...props };

  await TestBed.configureTestingModule({
    imports: [GameListEntry],
    providers: [provideTranslateService(), { provide: ActivatedRoute, useValue: {} }],
  }).compileComponents();

  const fixture = TestBed.createComponent(GameListEntry, {
    bindings: [
      inputBinding('game', signal(mergedProps.game)),
      inputBinding('statusLabel', signal(mergedProps.gameStatus)),
      inputBinding('homeScore', signal(mergedProps.homeScore)),
      inputBinding('awayScore', signal(mergedProps.awayScore)),
      inputBinding('isLive', signal(mergedProps.isLive)),
      inputBinding('isUpcoming', signal(mergedProps.isUpcoming)),
    ],
  });
  const component = fixture.componentInstance;
  fixture.detectChanges();
  await fixture.whenStable();

  return {
    component,
    fixture,
  };
}

interface Props {
  game: Game;
  isLive: boolean;
  gameStatus: string;
  homeScore: number;
  awayScore: number;
  isUpcoming: boolean;
}
