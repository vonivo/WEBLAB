import { TestBed } from '@angular/core/testing';
import { GameDetailHeader } from './game-detail-header';
import { Game } from '../../game.types';
import { provideTranslateService } from '@ngx-translate/core';
import { inputBinding, signal } from '@angular/core';

describe('GameDetailHeader', () => {
  it('should create', async () => {
    const { component } = await setup();
    expect(component).toBeTruthy();
  });

  it('should render both teams and their logos', async () => {
    const { fixture } = await setup();

    const element = fixture.nativeElement;
    const images = element.querySelectorAll('img');

    expect(element.textContent).toContain('Team A');
    expect(element.textContent).toContain('Team B');

    expect(images[0].src).toContain('LogoTeamA.png');
    expect(images[0].alt).toBe('Team A logo');

    expect(images[1].src).toContain('LogoTeamB.png');
    expect(images[1].alt).toBe('Team B logo');
  });

  it('should render the current score', async () => {
    const { fixture } = await setup({ homeScore: 2, awayScore: 1 });
    const score = fixture.nativeElement.querySelector('.font-display').textContent;

    expect(score).toContain('2');
    expect(score).toContain(':');
    expect(score).toContain('1');
  });

  it('should render the game status and start date', async () => {
    const { fixture } = await setup({ statusLabel: 'Upcoming' });
    const element = fixture.nativeElement;

    expect(element.textContent).toContain('Upcoming');
    expect(element.textContent).toContain('Sep 11, 2026');
  });

  it('should show the live indicator when the game is live', async () => {
    const { fixture } = await setup({ statusLabel: 'Live', isLive: true });

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.animate-ping')).toBeTruthy();
  });

  it('should hide the live indicator when the game is not live', async () => {
    const { fixture } = await setup({ statusLabel: 'Upcoming' });

    expect(fixture.nativeElement.querySelector('.animate-ping')).toBeNull();
  });
});

const defaultProps: Props = {
  homeScore: 0,
  awayScore: 0,
  isLive: false,
  statusLabel: 'upcoming',
  game: {
    _id: 'upcomingGame1',
    startDate: new Date('09/11/2026'),
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
};

async function setup(props: Partial<Props> = {}) {
  const mergedProps = { ...defaultProps, ...props };

  await TestBed.configureTestingModule({
    imports: [GameDetailHeader],
    providers: [provideTranslateService()],
  }).compileComponents();

  const fixture = TestBed.createComponent(GameDetailHeader, {
    bindings: [
      inputBinding('game', signal(mergedProps.game)),
      inputBinding('isLive', signal(mergedProps.isLive)),
      inputBinding('statusLabel', signal(mergedProps.statusLabel)),
      inputBinding('homeScore', signal(mergedProps.homeScore)),
      inputBinding('awayScore', signal(mergedProps.awayScore)),
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
  homeScore: number;
  awayScore: number;
  statusLabel: string;
}
