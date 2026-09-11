import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddGameEvent } from './add-game-event';
import { provideTranslateService } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { GameDetail } from '../game-detail/game-detail';
import { AddGameEventForm } from '../../dumb_components/add-game-event/add-game-event-form.component';
import { inputBinding, signal } from '@angular/core';
import { vi } from 'vitest';
import { GameApi } from '../../service/game.api';
import { of } from 'rxjs';

describe('AddGameEvent', () => {
  it('should create', async () => {
    const { component } = await setup();

    expect(component).toBeTruthy();
  });

  it('should set the gameId in GameApi', async () => {
    const { gameApiMock } = await setup();

    expect(gameApiMock.setGameId).toHaveBeenCalledExactlyOnceWith('gameId');
  });

  it('should handle onCancel', async () => {
    const { component, fixture } = await setup();

    vi.spyOn(component.onCancel, 'emit');

    const form = fixture.debugElement.query(By.directive(AddGameEventForm));
    form.triggerEventHandler('onCancel', {});

    expect(component.onCancel.emit).toHaveBeenCalledOnce();
  });

  it('should handle onGameEventCreated', async () => {
    const { component, fixture, gameApiMock } = await setup();

    vi.spyOn(component.onGameEventCreated, 'emit');
    vi.spyOn(gameApiMock.getGameResource(), 'reload');

    const form = fixture.debugElement.query(By.directive(AddGameEventForm));
    form.triggerEventHandler('onGameEventCreated', {});

    expect(gameApiMock.createGameEvent).toHaveBeenCalledOnce();
    expect(component.onGameEventCreated.emit).toHaveBeenCalledOnce();
    expect(gameApiMock.getGameResource().reload).toHaveBeenCalledOnce();
  });
});

async function setup() {
  const gameApiMock = {
    getGameResource: vi.fn(),
    setGameId: vi.fn(),
    createGameEvent: vi.fn(),
  };

  gameApiMock.createGameEvent.mockReturnValue(of({}));

  gameApiMock.getGameResource.mockReturnValue({
    value: () => [],
    reload: () => {},
  });

  await TestBed.configureTestingModule({
    imports: [AddGameEvent],
    providers: [provideTranslateService(), { provide: GameApi, useValue: gameApiMock }],
  }).compileComponents();

  const fixture = TestBed.createComponent(AddGameEvent, {
    bindings: [inputBinding('gameId', signal('gameId'))],
  });
  const component = fixture.componentInstance;
  fixture.detectChanges();
  await fixture.whenStable();

  return {
    fixture,
    component,
    gameApiMock,
  };
}
