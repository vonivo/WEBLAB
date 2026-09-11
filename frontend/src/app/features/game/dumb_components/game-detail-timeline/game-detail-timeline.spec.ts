import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameDetailTimeline } from './game-detail-timeline';
import { Game, GameEventType, GameSide } from '../../game.types';
import { inputBinding, signal } from '@angular/core';
import { provideTranslateService } from '@ngx-translate/core';

describe('GameDetailTimeline', () => {
  it('should create', async () => {
    const { component } = await setup();

    expect(component).toBeTruthy();
  });

  it('should render all game events', async () => {
    const { fixture } = await setup();
    const events = fixture.nativeElement.querySelectorAll('ol > li');

    expect(events.length).toBe(8);
  });

  it('should render the event minute including extra time', async () => {
    const { fixture } = await setup();
    const events = fixture.nativeElement.querySelectorAll('ol > li');

    expect(events[0].textContent).toContain("0'");
    expect(events[2].textContent).toContain("20+2'");
    expect(events[3].textContent).toContain("45'");
  });

  it('should render the goal scorer', async () => {
    const { fixture } = await setup();
    const events = fixture.nativeElement.querySelectorAll('ol > li');
    const goalEvent = events[2];

    expect(goalEvent.textContent).toContain('Harry Potter');
  });

  it('should render the assist for a goal', async () => {
    const { fixture } = await setup();
    const events = fixture.nativeElement.querySelectorAll('ol > li');
    const goalEvent = events[2];

    expect(goalEvent.textContent).toContain('Assist Ron Weasley');
  });

  it('should not render an assist when the event has no secondary player', async () => {
    const { fixture } = await setup();
    const events = fixture.nativeElement.querySelectorAll('ol > li');
    const goalEvent = events[4];

    expect(goalEvent.textContent).not.toContain('Assist');
  });

  it('should render the correct icon for each event type', async () => {
    const { fixture } = await setup();
    const icons = fixture.nativeElement.querySelectorAll('mat-icon');

    expect(icons[0].textContent.trim()).toBe('sports');
    expect(icons[1].textContent.trim()).toBe('schedule');
    expect(icons[2].textContent.trim()).toBe('sports_soccer');
    expect(icons[3].textContent.trim()).toBe('schedule');
    expect(icons[4].textContent.trim()).toBe('sports_soccer');
    expect(icons[5].textContent.trim()).toBe('schedule');
    expect(icons[6].textContent.trim()).toBe('schedule');
    expect(icons[7].textContent.trim()).toBe('sports');
  });

  it('should render the connecting rail between events but not after the last event', async () => {
    const { fixture } = await setup();
    const events = fixture.nativeElement.querySelectorAll('ol > li');

    expect(events[0].querySelector('span.absolute')).toBeTruthy();
    expect(events[1].querySelector('span.absolute')).toBeTruthy();
    expect(events[2].querySelector('span.absolute')).toBeTruthy();
    expect(events[7].querySelector('span.absolute')).toBeNull();
  });
});

const defaultProps: Props = {
  game: {
    _id: 'upcomingGame1',
    startDate: new Date('09/11/2026'),
    homeTeam: {
      team: 'teamAID',
      name: 'Team A',
      logoUrl: 'LogoTeamA.png',
      players: [
        { _id: '1', firstname: 'Harry', lastname: 'Potter' },
        { _id: '2', firstname: 'Ron', lastname: 'Weasley' },
      ],
    },
    awayTeam: {
      team: 'teamBID',
      name: 'Team B',
      logoUrl: 'LogoTeamB.png',
      players: [
        { _id: '3', firstname: 'Severus', lastname: 'Snape' },
        { _id: '4', firstname: 'Dobby', lastname: 'The House elf' },
      ],
    },
    events: [
      {
        _id: 'event-1',
        type: GameEventType.KICKOFF,
        minute: 0,
      },
      {
        _id: 'event-2',
        type: GameEventType.PERIOD_START,
        minute: 0,
      },
      {
        _id: 'event-3',
        type: GameEventType.GOAL,
        minute: 20,
        minuteExtra: 2,
        team: GameSide.HOME,
        primaryPlayerId: '1',
        secondaryPlayerId: '2',
      },
      {
        _id: 'event-4',
        type: GameEventType.HALF_TIME,
        minute: 45,
      },
      {
        _id: 'event-5',
        type: GameEventType.GOAL,
        minute: 67,
        team: GameSide.AWAY,
        primaryPlayerId: '3',
      },
      {
        _id: 'event-6',
        type: GameEventType.PERIOD_END,
        minute: 90,
      },
      {
        _id: 'event-7',
        type: GameEventType.OVERTIME_START,
        minute: 90,
      },
      {
        _id: 'event-8',
        type: GameEventType.GAME_END,
        minute: 120,
      },
    ],
  },
};

async function setup() {
  await TestBed.configureTestingModule({
    imports: [GameDetailTimeline],
    providers: [provideTranslateService()],
  }).compileComponents();

  const fixture = TestBed.createComponent(GameDetailTimeline, {
    bindings: [inputBinding('game', signal(defaultProps.game))],
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
}
