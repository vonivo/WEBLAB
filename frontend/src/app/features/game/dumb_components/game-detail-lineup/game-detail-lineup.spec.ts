import { TestBed } from '@angular/core/testing';
import { GameDetailLineup } from './game-detail-lineup';
import { Game, GameTeam } from '../../game.types';
import { inputBinding, signal } from '@angular/core';
import { Player } from '../../../../core/types/team.types';

describe('GameDetailLineup', () => {
  it('should create', async () => {
    const { component } = await setup();
    expect(component).toBeTruthy();
  });

  it('should render all teams', async () => {
    const { fixture } = await setup();
    const element = fixture.nativeElement;

    expect(element.textContent).toContain('Team A');
    expect(element.textContent).toContain('Team B');
  });

  it('should render team logos when available', async () => {
    const { fixture } = await setup();
    const images = fixture.nativeElement.querySelectorAll('img');

    expect(images.length).toBe(2);

    expect(images[0].src).toContain('LogoTeamA.png');
    expect(images[0].alt).toBe('Team A logo');

    expect(images[1].src).toContain('LogoTeamB.png');
    expect(images[1].alt).toBe('Team B logo');
  });

  it('should render players with their lineup numbers', async () => {
    const { fixture } = await setup();
    const element = fixture.nativeElement;

    expect(element.textContent).toContain('Harry Potter');
    expect(element.textContent).toContain('Ron Weasley');
    expect(element.textContent).toContain('Severus Snape');
    expect(element.textContent).toContain('Dobby The House elf');
  });

  it('should show an empty lineup message when a team has no players', async () => {
    const { fixture } = await setup({
      game: {
        ...defaultProps.game,
        homeTeam: {
          ...defaultProps.game.homeTeam,
          players: [] as Player[],
        },
      },
    });
    const messages = fixture.nativeElement.querySelectorAll('p');

    expect(messages.length).toBe(1);
    expect(messages[0].textContent.trim()).toBe('No lineup set yet.');
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
    events: [],
  },
};

async function setup(props: Partial<Props> = {}) {
  const mergedProps = { ...defaultProps, ...props };
  await TestBed.configureTestingModule({
    imports: [GameDetailLineup],
  }).compileComponents();

  const fixture = TestBed.createComponent(GameDetailLineup, {
    bindings: [inputBinding('game', signal(mergedProps.game))],
  });
  const component = fixture.componentInstance;
  await fixture.whenStable();

  return {
    component,
    fixture,
  };
}

interface Props {
  game: Game;
}
