import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateGame } from './create-game';
import { Router } from '@angular/router';
import { AddGame } from '../../smart_containers/add-game/add-game';
import { By } from '@angular/platform-browser';
import { Game } from '../../game.types';

describe('CreateGame', () => {
  it('should create', async () => {
    const { component } = await setUp();

    expect(component).toBeTruthy();
  });

  it('should render the AddGame component', async () => {
    const { fixture } = await setUp();

    const addGame = fixture.debugElement.query(By.directive(AddGame));

    expect(addGame).toBeTruthy();
  });

  it('should handle the game created event from AddGame', async () => {
    const { fixture, router } = await setUp();

    const game = {
      _id: 'game-456',
    } as Game;

    const addGame = fixture.debugElement.query(By.directive(AddGame));

    addGame.triggerEventHandler('onGameCreated', game);

    expect(router.navigate).toHaveBeenCalledExactlyOnceWith(['/games', 'game-456']);
  });

  it('should handle the cancel event from AddGame', async () => {
    const { fixture, router } = await setUp();

    const addGame = fixture.debugElement.query(By.directive(AddGame));

    addGame.triggerEventHandler('onCancelClick');

    expect(router.navigate).toHaveBeenCalledExactlyOnceWith(['/games']);
  });
});

async function setUp() {
  const router: Pick<Router, 'navigate'> = {
    navigate: vi.fn(),
  };

  await TestBed.configureTestingModule({
    imports: [CreateGame],
    providers: [
      {
        provide: Router,
        useValue: router,
      },
    ],
  }).compileComponents();

  const fixture: ComponentFixture<CreateGame> = TestBed.createComponent(CreateGame);

  const component = fixture.componentInstance;

  fixture.detectChanges();

  return {
    component,
    fixture,
    router,
  };
}
