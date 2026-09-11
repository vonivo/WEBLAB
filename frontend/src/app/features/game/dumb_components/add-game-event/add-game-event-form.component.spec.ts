import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Game, GameEvent, GameEventType, GameSide } from '../../game.types';
import { Player } from '../../../../core/types/team.types';
import { AddGameEventForm } from './add-game-event-form.component';
import { provideTranslateService } from '@ngx-translate/core';

describe('AddGameEventForm', () => {
  it('should create', async () => {
    const { component } = await setUp();

    expect(component).toBeTruthy();
  });

  it('should not render goal fields when the event type is not GOAL', async () => {
    const { fixture } = await setUp();

    const selects = fixture.debugElement.queryAll(By.css('mat-select'));

    expect(selects).toHaveLength(1);
  });

  it('should render goal fields when GOAL is selected', async () => {
    const { fixture, component } = await setUp();

    component.createEventModle.update((model) => ({
      ...model,
      type: GameEventType.GOAL,
    }));

    fixture.detectChanges();

    const selects = fixture.debugElement.queryAll(By.css('mat-select'));

    expect(selects).toHaveLength(4);
  });

  it('should render home team players in primaryPlayer select when HOME is selected', async () => {
    const { fixture, component } = await setUp();

    component.createEventModle.set({
      ...component.createEventModle(),
      type: GameEventType.GOAL,
      side: GameSide.HOME,
    });

    fixture.detectChanges();

    const primaryPlayerSelect = fixture.debugElement.query(
      By.css('[data-testid="AGEF_PRIMARY_PLAYER_SELECT"]'),
    );
    const secondaryPlayerSelect = fixture.debugElement.query(
      By.css('[data-testid="AGEF_SECONDARY_PLAYER_SELECT"]'),
    );
    primaryPlayerSelect.nativeElement.click();
    secondaryPlayerSelect.nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const primaryOptions = fixture.debugElement.queryAll(
      By.css('[data-testid^="AGEF_PRIMARY_PLAYER_OPTION_"]'),
    );
    const primaryOptionTexts = primaryOptions.map((option) =>
      option.nativeElement.textContent.trim(),
    );
    const secondaryOptions = fixture.debugElement.queryAll(
      By.css('[data-testid^="AGEF_SECONDARY_PLAYER_OPTION_"]'),
    );
    const secondaryOptionsTexts = secondaryOptions.map((option) =>
      option.nativeElement.textContent.trim(),
    );

    expect(primaryOptionTexts).toContain('John Home');
    expect(primaryOptionTexts).toContain('Jane Home');
    expect(secondaryOptionsTexts).toContain('John Home');
    expect(secondaryOptionsTexts).toContain('Jane Home');
  });

  it('should render away team players when AWAY is selected', async () => {
    const { fixture, component } = await setUp();

    component.createEventModle.set({
      ...component.createEventModle(),
      type: GameEventType.GOAL,
      side: GameSide.AWAY,
    });

    fixture.detectChanges();

    const primaryPlayerSelect = fixture.debugElement.query(
      By.css('[data-testid="AGEF_PRIMARY_PLAYER_SELECT"]'),
    );
    const secondaryPlayerSelect = fixture.debugElement.query(
      By.css('[data-testid="AGEF_SECONDARY_PLAYER_SELECT"]'),
    );
    primaryPlayerSelect.nativeElement.click();
    secondaryPlayerSelect.nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const primaryOptions = fixture.debugElement.queryAll(
      By.css('[data-testid^="AGEF_PRIMARY_PLAYER_OPTION_"]'),
    );
    const primaryOptionTexts = primaryOptions.map((option) =>
      option.nativeElement.textContent.trim(),
    );
    const secondaryOptions = fixture.debugElement.queryAll(
      By.css('[data-testid^="AGEF_SECONDARY_PLAYER_OPTION_"]'),
    );
    const secondaryOptionsTexts = secondaryOptions.map((option) =>
      option.nativeElement.textContent.trim(),
    );

    expect(primaryOptionTexts).toContain('John Away');
    expect(secondaryOptionsTexts).toContain('John Away');
  });

  it('should emit onCancel when the cancel button is clicked', async () => {
    const { fixture, component } = await setUp();

    const onCancel = vi.fn();
    component.onCancel.subscribe(onCancel);

    const button = fixture.debugElement.query(By.css('button[type="button"]'));

    button.triggerEventHandler('click');

    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('should not emit onGameEventCreated when the form is invalid', async () => {
    const { fixture, component } = await setUp();

    const onGameEventCreated = vi.fn();
    component.onGameEventCreated.subscribe(onGameEventCreated);

    const form = fixture.debugElement.query(By.css('form'));

    form.triggerEventHandler('ngSubmit', new Event('submit'));

    expect(onGameEventCreated).not.toHaveBeenCalled();
  });

  it('should emit onGameEventCreated when the form is valid', async () => {
    const { fixture, component } = await setUp();

    const onGameEventCreated = vi.fn();
    component.onGameEventCreated.subscribe(onGameEventCreated);

    component.createEventModle.set({
      type: GameEventType.GOAL,
      minute: 42,
      minuteExtra: 3,
      side: GameSide.HOME,
      primaryPlayer: homePlayer,
      secondaryPlayer: homePlayer2,
    });

    fixture.detectChanges();

    const form = fixture.debugElement.query(By.css('form'));

    form.triggerEventHandler('ngSubmit', new Event('submit'));

    const expectedEvent: GameEvent = {
      minute: 42,
      minuteExtra: 3,
      type: GameEventType.GOAL,
      team: GameSide.HOME,
      primaryPlayerId: 'player-home-1',
      secondaryPlayerId: 'player-home-2',
    };

    expect(onGameEventCreated).toHaveBeenCalledExactlyOnceWith(expectedEvent);
  });

  it('should reset player selection when the event type changes', async () => {
    const { fixture, component } = await setUp();

    component.createEventModle.set({
      type: GameEventType.GOAL,
      minute: 20,
      minuteExtra: 0,
      side: GameSide.HOME,
      primaryPlayer: homePlayer,
      secondaryPlayer: homePlayer2,
    });

    fixture.detectChanges();

    const eventTypeSelect = fixture.debugElement.query(By.css('mat-select'));

    eventTypeSelect.triggerEventHandler('selectionChange', {});

    expect(component.createEventModle()).toEqual({
      type: GameEventType.GOAL,
      minute: 20,
      minuteExtra: 0,
      side: null,
      primaryPlayer: null,
      secondaryPlayer: null,
    });
  });

  it('should require the event type', async () => {
    const { component } = await setUp();

    component.createEventModle.update((model) => ({
      ...model,
      type: null,
    }));

    expect(component.createEventForm.type().valid()).toBe(false);
  });

  it('should reject a negative minute', async () => {
    const { component } = await setUp();

    component.createEventModle.set({
      type: GameEventType.KICKOFF,
      minute: -1,
      minuteExtra: 0,
      side: null,
      primaryPlayer: null,
      secondaryPlayer: null,
    });

    expect(component.createEventForm.minute().valid()).toBe(false);
  });

  it('should reject a negative extra minute', async () => {
    const { component } = await setUp();

    component.createEventModle.set({
      type: GameEventType.KICKOFF,
      minute: 10,
      minuteExtra: -1,
      side: null,
      primaryPlayer: null,
      secondaryPlayer: null,
    });

    expect(component.createEventForm.minuteExtra().valid()).toBe(false);
  });

  it('should require the side for a goal', async () => {
    const { component } = await setUp();

    component.createEventModle.set({
      type: GameEventType.GOAL,
      minute: 10,
      minuteExtra: 0,
      side: null,
      primaryPlayer: homePlayer,
      secondaryPlayer: null,
    });

    expect(component.createEventForm.side().valid()).toBe(false);
  });

  it('should require the primary player for a goal', async () => {
    const { component } = await setUp();

    component.createEventModle.set({
      type: GameEventType.GOAL,
      minute: 10,
      minuteExtra: 0,
      side: GameSide.HOME,
      primaryPlayer: null,
      secondaryPlayer: null,
    });

    expect(component.createEventForm.primaryPlayer().valid()).toBe(false);
  });
});

const homePlayer = {
  _id: 'player-home-1',
  firstname: 'John',
  lastname: 'Home',
} as Player;

const homePlayer2 = {
  _id: 'player-home-2',
  firstname: 'Jane',
  lastname: 'Home',
} as Player;

const awayPlayer = {
  _id: 'player-away-1',
  firstname: 'John',
  lastname: 'Away',
} as Player;

async function setUp() {
  const game = {
    _id: 'game-123',
    homeTeam: {
      players: [homePlayer, homePlayer2],
    },
    awayTeam: {
      players: [awayPlayer],
    },
  } as Game;

  await TestBed.configureTestingModule({
    imports: [AddGameEventForm],
    providers: [provideTranslateService()],
  }).compileComponents();

  const fixture: ComponentFixture<AddGameEventForm> = TestBed.createComponent(AddGameEventForm);

  const component = fixture.componentInstance;

  fixture.componentRef.setInput('game', game);

  fixture.detectChanges();

  return {
    component,
    fixture,
    game,
  };
}
