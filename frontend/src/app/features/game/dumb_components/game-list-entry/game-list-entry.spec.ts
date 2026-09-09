import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameListEntry } from './game-list-entry';
import { Game } from '../../game.types';
import { inputBinding, signal } from '@angular/core';
import { By } from '@angular/platform-browser';

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
  },
};

async function setUp() {
  await TestBed.configureTestingModule({
    imports: [GameListEntry],
  }).compileComponents();

  const fixture = TestBed.createComponent(GameListEntry, {
    bindings: [inputBinding('game', signal(defaultProps.game))],
  });
  const component = fixture.componentInstance;
  fixture.detectChanges();

  return {
    component,
    fixture,
  };
}

interface Props {
  game: Game;
}
