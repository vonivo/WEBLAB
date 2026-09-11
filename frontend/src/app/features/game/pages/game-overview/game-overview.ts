import { Component, inject } from '@angular/core';
import { AddGame } from '../../smart_containers/add-game/add-game';
import { GameList } from '../../smart_containers/game-list/game-list';
import { TranslatePipe } from '@ngx-translate/core';
import { MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../authentication/auth.service';

@Component({
  imports: [GameList, TranslatePipe, MatFabButton, MatIcon, RouterLink],
  selector: 'app-match-overview',
  styleUrl: './game-overview.css',
  templateUrl: './game-overview.html',
})
export class GameOverview {
  private readonly AuthService = inject(AuthService);
  private readonly dialog = inject(MatDialog);

  isLoggedIn = this.AuthService.isLoggedIn;

  handleAddGameClick() {
    this.dialog.open(AddGameDialog);
  }
}

@Component({
  selector: 'dialog-add-game',
  template:
    '<app-add-game (onCancelClick)="handleDialogClick()" (onGameCreated)="handleDialogClick()"></app-add-game>',
  imports: [AddGame],
})
export class AddGameDialog {
  readonly dialogRef = inject(MatDialogRef<AddGameDialog>);

  handleDialogClick() {
    this.dialogRef.close();
  }
}
