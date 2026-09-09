import { Component, inject, OnInit, output } from '@angular/core';
import { AddGameForm } from '../../dumb_components/add-game-form/add-game-form';
import { TeamApi } from '../../../../core/services/team.api';
import { CreateGame, Game } from '../../game.types';
import { GameApi } from '../../service/game.api';

@Component({
  imports: [AddGameForm],
  selector: 'app-add-game',
  styleUrl: './add-game.css',
  templateUrl: './add-game.html',
})
export class AddGame implements OnInit {
  private readonly teamApi = inject(TeamApi);
  private readonly gameApi = inject(GameApi);

  onGameCreated = output<Game>();
  onCancelClick = output();

  teams = this.teamApi.getTeamsResource();

  ngOnInit() {
    this.teams.reload();
  }

  handleGameCreated(createdGame: CreateGame) {
    this.gameApi.createGame(createdGame).subscribe((game) => {
      this.gameApi.getGamesResource().reload();
      this.onGameCreated.emit(game);
    });
  }
}
