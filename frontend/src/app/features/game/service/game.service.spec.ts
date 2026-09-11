import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { describe, expect, beforeEach, it, vi } from 'vitest';

import { Game, GameEvent, GameEventType, GameSide } from '../game.types';
import { GameService } from './game.service';

describe('GameService', () => {
  let service: GameService;
  let translateService: {
    translate: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    translateService = {
      translate: vi.fn((key: string) => () => key),
    };

    TestBed.configureTestingModule({
      providers: [
        GameService,
        {
          provide: TranslateService,
          useValue: translateService,
        },
      ],
    });

    service = TestBed.inject(GameService);
  });

  describe('isLive', () => {
    it('should return true when the game has started and has not ended', () => {
      const game = {
        events: [{ type: GameEventType.KICKOFF }],
      } as Game;

      expect(service.isLive(game)).toBe(true);
    });

    it('should return false when the game has not started', () => {
      const game = {
        events: [] as GameEvent[],
      } as Game;

      expect(service.isLive(game)).toBe(false);
    });

    it('should return false when the game has ended', () => {
      const game = {
        events: [{ type: GameEventType.KICKOFF }, { type: GameEventType.GAME_END }],
      } as Game;

      expect(service.isLive(game)).toBe(false);
    });
  });

  describe('getStatusLabel', () => {
    it('should return the live translation key for a live game', () => {
      const game = {
        events: [{ type: GameEventType.KICKOFF }],
      } as Game;

      expect(service.getStatusLabel(game)).toBe('types.game.live');
      expect(translateService.translate).toHaveBeenCalledWith('types.game.live');
    });

    it('should return the upcoming translation key for a game that has not started', () => {
      const game = {
        events: [] as GameEvent[],
      } as Game;

      expect(service.getStatusLabel(game)).toBe('types.game.upcoming');
      expect(translateService.translate).toHaveBeenCalledWith('types.game.upcoming');
    });

    it('should return the finished translation key for a finished game', () => {
      const game = {
        events: [{ type: GameEventType.KICKOFF }, { type: GameEventType.GAME_END }],
      } as Game;

      expect(service.getStatusLabel(game)).toBe('types.game.finished');
      expect(translateService.translate).toHaveBeenCalledWith('types.game.finished');
    });
  });

  describe('countGoalsFor', () => {
    it('should count goals scored by the requested side', () => {
      const game = {
        events: [
          { type: GameEventType.GOAL, team: GameSide.HOME },
          { type: GameEventType.GOAL, team: GameSide.HOME },
          { type: GameEventType.GOAL, team: GameSide.AWAY },
        ],
      } as Game;

      expect(service.countGoalsFor(GameSide.HOME, game)).toBe(2);
      expect(service.countGoalsFor(GameSide.AWAY, game)).toBe(1);
    });

    it('should return 0 when the requested side has no goals', () => {
      const game = {
        events: [{ type: GameEventType.GOAL, team: GameSide.HOME }],
      } as Game;

      expect(service.countGoalsFor(GameSide.AWAY, game)).toBe(0);
    });

    it('should ignore non-goal events', () => {
      const game = {
        events: [
          { type: GameEventType.KICKOFF },
          { type: GameEventType.GOAL, team: GameSide.HOME },
          { type: GameEventType.GAME_END },
        ],
      } as Game;

      expect(service.countGoalsFor(GameSide.HOME, game)).toBe(1);
    });
  });
});
