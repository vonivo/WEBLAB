import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';
import { MatDialog } from '@angular/material/dialog';
import { GameOverview, AddGameDialog } from './game-overview';
import { GameList } from '../../smart_containers/game-list/game-list';
import { provideTranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { GameApi } from '../../service/game.api';
import { signal } from '@angular/core';
import { AuthService } from '../../../../authentication/auth.service';

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

  it('should render the add game button if logged in', async () => {
    const { fixture } = await setUp(true);

    const buttons = fixture.debugElement.queryAll(By.css('button[matFab]'));

    expect(buttons).toHaveLength(1);
  });

  it('should open the add game dialog when the desktop button is clicked', async () => {
    const { fixture, dialog } = await setUp(true);

    const button = fixture.debugElement.query(By.css('button[matFab]'));

    button.triggerEventHandler('click');

    expect(dialog.open).toHaveBeenCalledExactlyOnceWith(AddGameDialog);
  });

  it('should not render add game button when not logged in', async () => {
    const { fixture, dialog } = await setUp();

    const button = fixture.debugElement.query(By.css('button[matFab]'));

    expect(button).toBeFalsy();
  });
});

async function setUp(isLoggedIn = false) {
  const dialog = {
    open: vi.fn(),
  };

  const authServiceMock = {
    isLoggedIn: signal(isLoggedIn),
  };

  const gameApiMock = {
    getGamesResource: vi.fn(),
  };

  gameApiMock.getGamesResource.mockReturnValue({
    value: () => [],
    reload: () => {},
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
      { provide: AuthService, useValue: authServiceMock },
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
