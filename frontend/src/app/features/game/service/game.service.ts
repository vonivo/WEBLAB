import { inject, Injectable } from '@angular/core';
import { Game, GameEventType, GameSide } from '../game.types';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly translateService = inject(TranslateService);

  isLive(game: Game) {
    const started = game.events.map((e) => e.type).some((t) => t === GameEventType.KICKOFF);
    const ended = game.events.map((e) => e.type).some((t) => t === GameEventType.GAME_END);

    return started && !ended;
  }

  isUpcoming(game: Game) {
    return game.events.map((e) => e.type).some((t) => t === GameEventType.KICKOFF);
  }

  getStatusLabel(game: Game) {
    const started = game.events.map((e) => e.type).some((t) => t === GameEventType.KICKOFF);
    if (this.isLive(game)) {
      return this.translateService.translate(`types.game.live`)();
    } else if (!started) {
      return this.translateService.translate(`types.game.upcoming`)();
    }
    return this.translateService.translate(`types.game.finished`)();
  }

  countGoalsFor(side: GameSide, game: Game): number {
    return game.events.filter((e) => e.type === GameEventType.GOAL && e.team === side).length;
  }
}
