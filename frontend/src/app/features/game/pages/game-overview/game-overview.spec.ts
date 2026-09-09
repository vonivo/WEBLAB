import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';
import { MatDialog } from '@angular/material/dialog';
import { GameOverview, AddGameDialog } from './game-overview';
import { GameList } from '../../smart_containers/game-list/game-list';
import { provideTranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { GameApi } from '../../service/game.api';

describe('GameOverview', () => {
  it('should create', async () => {
    const { component } = await setUp();

    expect(component).toBeTruthy();
  });

  it('should render the game list', async () => {
    const { fixture } = await setUp();

    const gameList = fixture.debugElement.query(By.directive(GameList));

    expect(gameList).toBeTruthy();
  });

  it('should render the add game button', async () => {
    const { fixture } = await setUp();

    const buttons = fixture.debugElement.queryAll(By.css('button[matFab]'));

    expect(buttons).toHaveLength(1);
  });

  it('should open the add game dialog when the desktop button is clicked', async () => {
    const { fixture, dialog } = await setUp();

    const button = fixture.debugElement.query(By.css('button[matFab]'));

    button.triggerEventHandler('click');

    expect(dialog.open).toHaveBeenCalledExactlyOnceWith(AddGameDialog);
  });
});

async function setUp() {
  const dialog = {
    open: vi.fn(),
  };

  const gameApiMock = {
    getGamesResource: vi.fn(),
  };

  gameApiMock.getGamesResource.mockReturnValue({
    value: () => [],
  });

  await TestBed.configureTestingModule({
    imports: [GameOverview],
    providers: [
      provideTranslateService(),
      { provide: ActivatedRoute, useValue: {} },
      { provide: GameApi, useValue: gameApiMock },
      {
        provide: MatDialog,
        useValue: dialog,
      },
    ],
  }).compileComponents();

  const fixture: ComponentFixture<GameOverview> = TestBed.createComponent(GameOverview);

  const component = fixture.componentInstance;
  fixture.detectChanges();
  await fixture.whenStable();

  return {
    component,
    fixture,
    dialog,
  };
}
