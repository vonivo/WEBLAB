import { TestBed } from '@angular/core/testing';
import { GameDetailView } from './game-detail-view';
import { Game } from '../../game.types';
import { inputBinding, signal } from '@angular/core';
import { provideTranslateService } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { GameDetailHeader } from '../game-detail-header/game-detail-header';

describe('GameDetailView', () => {
  it('should create', async () => {
    const { component } = await setup();
    expect(component).toBeTruthy();
  });

  it('should render GameDetailHeader', async () => {
    const { fixture } = await setup();
    const header = fixture.debugElement.query(By.directive(GameDetailHeader));
    expect(header).toBeTruthy();
  });
});

const defaultProps: Props = {
  homeScore: 0,
  awayScore: 0,
  isLive: false,
  statusLable: 'upcoming',
  game: {
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
};

async function setup() {
  await TestBed.configureTestingModule({
    imports: [GameDetailView],
    providers: [provideTranslateService()],
  }).compileComponents();

  const fixture = TestBed.createComponent(GameDetailView, {
    bindings: [
      inputBinding('game', signal(defaultProps.game)),
      inputBinding('isLive', signal(defaultProps.isLive)),
      inputBinding('statusLabel', signal(defaultProps.statusLable)),
      inputBinding('homeScore', signal(defaultProps.homeScore)),
      inputBinding('awayScore', signal(defaultProps.awayScore)),
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
  homeScore: number;
  awayScore: number;
  isLive: boolean;
  statusLable: string;
}
