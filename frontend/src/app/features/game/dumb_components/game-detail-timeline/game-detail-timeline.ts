import { Component, computed, inject, input } from '@angular/core';
import { Game, GameEvent, GameEventType } from '../../game.types';
import { Player } from '../../../../core/types/team.types';
import { TranslateService } from '@ngx-translate/core';
import { NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  imports: [NgClass, MatIcon],
  selector: 'app-game-detail-timeline',
  styleUrl: './game-detail-timeline.css',
  templateUrl: './game-detail-timeline.html',
})
export class GameDetailTimeline {
  private readonly translateService = inject(TranslateService);

  game = input.required<Game>();

  private totalMinute(event: GameEvent): number {
    return event.minute + (event.minuteExtra ?? 0) / 100;
  }

  markerClasses(event: GameEvent): string {
    switch (event.type) {
      case GameEventType.GOAL:
        return 'bg-[var(--stadium-goal)]';
      default:
        return 'bg-[var(--stadium-neutral)]';
    }
  }

  eventIcon(type: GameEventType): string {
    switch (type) {
      case GameEventType.GOAL:
        return 'sports_soccer';
      case GameEventType.GAME_END:
      case GameEventType.KICKOFF:
        return 'sports';
      case GameEventType.HALF_TIME:
      case GameEventType.PERIOD_START:
      case GameEventType.PERIOD_END:
      case GameEventType.OVERTIME_START:
        return 'schedule';
      default:
        return 'circle';
    }
  }

  eventMinuteLabel(event: GameEvent): string {
    return event.minuteExtra ? `${event.minute}+${event.minuteExtra}'` : `${event.minute}'`;
  }

  eventTitle(event: GameEvent): string {
    switch (event.type) {
      case GameEventType.GOAL:
        const player = this.getPlayerById(event.primaryPlayerId ?? '');
        if (player) {
          return `${this.translateService.translate(`types.game.fields.events.types.${event.type}`)()} ${this.getPlayerName(player)}`;
        }
        return this.translateService.translate(`types.game.fields.events.types.${event.type}`)();
      default:
        return this.translateService.translate(`types.game.fields.events.types.${event.type}`)();
    }
  }

  getAssist(playerId: string): string {
    const player = this.getPlayerById(playerId);
    if (player) {
      return `Assist ${this.getPlayerName(player)}`;
    }
    return '';
  }

  getPlayerName(player: Player) {
    return `${player.firstname} ${player.lastname}`;
  }

  getPlayerById(playerId: string) {
    const allPlayers = [...this.game().homeTeam.players, ...this.game().awayTeam.players];

    return allPlayers.find((p) => p._id === playerId);
  }
}
