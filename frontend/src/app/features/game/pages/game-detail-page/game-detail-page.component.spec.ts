import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { GameDetailPage } from './game-detail-page.component';
import { GameDetail } from '../../smart_containers/game-detail/game-detail';
import { AuthService } from '../../../../authentication/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { AddEventDialog } from './game-detail-page.component';
import { signal } from '@angular/core';
import { provideTranslateService } from '@ngx-translate/core';

describe('GameDetailPage', () => {
  it('should create', async () => {
    const { component } = await setUp();

    expect(component).toBeTruthy();
  });

  it('should render the GameDetail component', async () => {
    const { fixture } = await setUp();

    const gameDetail = fixture.debugElement.query(By.directive(GameDetail));

    expect(gameDetail).toBeTruthy();
  });

  it('should pass the gameId to GameDetail', async () => {
    const { fixture } = await setUp('game-456');

    const gameDetail = fixture.debugElement.query(By.directive(GameDetail));

    expect(gameDetail.componentInstance.gameId()).toBe('game-456');
  });

  it('should expose the gameId from the route', async () => {
    const { component } = await setUp('game-456');

    expect(component.gameId()).toBe('game-456');
  });

  it('should show the add event controls when logged in', async () => {
    const { fixture } = await setUp('game-456', true);

    const addEventButton = fixture.debugElement.query(
      By.css('button[aria-label="add game event"]'),
    );

    const addEventLink = fixture.debugElement.query(By.css('a[matFab]'));

    expect(addEventButton).toBeTruthy();
    expect(addEventLink).toBeTruthy();
  });

  it('should not show the add event controls when logged out', async () => {
    const { fixture } = await setUp('game-456', false);

    const addEventButton = fixture.debugElement.query(
      By.css('button[aria-label="add game event"]'),
    );

    const addEventLink = fixture.debugElement.query(By.css('a[matFab]'));

    expect(addEventButton).toBeFalsy();
    expect(addEventLink).toBeFalsy();
  });

  it('should open the add event dialog with the current gameId', async () => {
    const { component, dialog } = await setUp('game-456');

    component.handleAddClick();

    expect(dialog.open).toHaveBeenCalledExactlyOnceWith(AddEventDialog, {
      data: {
        game: 'game-456',
      },
    });
  });

  it('should open the add event dialog when the add button is clicked', async () => {
    const { fixture, dialog } = await setUp('game-456', true);

    const addEventButton = fixture.debugElement.query(
      By.css('button[aria-label="add game event"]'),
    );

    addEventButton.triggerEventHandler('click');

    expect(dialog.open).toHaveBeenCalledExactlyOnceWith(AddEventDialog, {
      data: {
        game: 'game-456',
      },
    });
  });
});

async function setUp(gameId?: string, loggedIn = true) {
  const isLoggedIn = signal(loggedIn);

  const authService: Pick<AuthService, 'isLoggedIn'> = {
    isLoggedIn,
  };

  const dialog: Pick<MatDialog, 'open'> = {
    open: vi.fn(),
  };

  const activatedRoute: Pick<ActivatedRoute, 'paramMap'> = {
    paramMap: of(new URLSearchParams(gameId ? `gameId=${gameId}` : '') as any),
  };

  await TestBed.configureTestingModule({
    imports: [GameDetailPage],
    providers: [
      provideTranslateService(),
      {
        provide: AuthService,
        useValue: authService,
      },
      {
        provide: MatDialog,
        useValue: dialog,
      },
      {
        provide: ActivatedRoute,
        useValue: activatedRoute,
      },
    ],
  }).compileComponents();

  const fixture: ComponentFixture<GameDetailPage> = TestBed.createComponent(GameDetailPage);

  const component = fixture.componentInstance;

  fixture.detectChanges();

  return {
    component,
    fixture,
    dialog,
    isLoggedIn,
  };
}
