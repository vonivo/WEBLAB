import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { CreateGameEvent } from './create-game-event';
import { AddGameEvent } from '../../smart_containers/add-game-event/add-game-event';
import { provideTranslateService } from '@ngx-translate/core';

describe('CreateGameEvent', () => {
  it('should create', async () => {
    const { component } = await setUp();

    expect(component).toBeTruthy();
  });

  it('should render the AddGameEvent component', async () => {
    const { fixture } = await setUp();

    const addGameEvent = fixture.debugElement.query(By.directive(AddGameEvent));

    expect(addGameEvent).toBeTruthy();
  });

  it('should pass the gameId to AddGameEvent', async () => {
    const { fixture } = await setUp('game-456');

    const addGameEvent = fixture.debugElement.query(By.directive(AddGameEvent));

    expect(addGameEvent.componentInstance.gameId()).toBe('game-456');
  });

  it('should handle the game event created event from AddGameEvent', async () => {
    const { fixture, router } = await setUp('game-456');

    const addGameEvent = fixture.debugElement.query(By.directive(AddGameEvent));

    addGameEvent.triggerEventHandler('onGameEventCreated');

    expect(router.navigate).toHaveBeenCalledExactlyOnceWith(['/games', 'game-456']);
  });

  it('should handle the cancel event from AddGameEvent', async () => {
    const { fixture, router } = await setUp('game-456');

    const addGameEvent = fixture.debugElement.query(By.directive(AddGameEvent));

    addGameEvent.triggerEventHandler('onCancel');

    expect(router.navigate).toHaveBeenCalledExactlyOnceWith(['/games', 'game-456']);
  });
});

async function setUp(gameId?: string) {
  const router: Pick<Router, 'navigate'> = {
    navigate: vi.fn(),
  };

  const activatedRoute: Pick<ActivatedRoute, 'paramMap'> = {
    paramMap: of(convertToParamMap(gameId ? { gameId } : {})),
  };

  await TestBed.configureTestingModule({
    imports: [CreateGameEvent],
    providers: [
      provideTranslateService(),
      {
        provide: Router,
        useValue: router,
      },
      {
        provide: ActivatedRoute,
        useValue: activatedRoute,
      },
    ],
  }).compileComponents();

  const fixture: ComponentFixture<CreateGameEvent> = TestBed.createComponent(CreateGameEvent);

  const component = fixture.componentInstance;

  fixture.detectChanges();

  return {
    component,
    fixture,
    router,
  };
}
