import { Component, computed, inject, model, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { GameDetail } from '../../smart_containers/game-detail/game-detail';
import { MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddGameEvent } from '../../smart_containers/add-game-event/add-game-event';
import { AuthService } from '../../../../authentication/auth.service';

export interface DialogData {
  game: string;
}

@Component({
  imports: [GameDetail, MatFabButton, MatIcon, RouterLink],
  selector: 'app-game-detail-page',
  styleUrl: './game-detail-page.component.css',
  templateUrl: './game-detail-page.component.html',
})
export class GameDetailPage {
  private readonly AuthService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);

  private readonly routeParams = toSignal(this.route.paramMap, { requireSync: true });
  readonly gameId = computed(() => this.routeParams().get('gameId') ?? '');

  isLoggedIn = this.AuthService.isLoggedIn;

  handleAddClick() {
    const dialogRef = this.dialog.open(AddEventDialog, {
      data: { game: this.gameId() },
    });
  }
}

@Component({
  selector: 'dialog-add-event',
  template:
    '<app-add-game-event [gameId]="gameId()" (onCancel)="handleDialogClick()" (onGameEventCreated)="handleDialogClick()"></app-add-game-event>',
  imports: [AddGameEvent],
})
export class AddEventDialog {
  readonly dialogRef = inject(MatDialogRef<AddEventDialog>);

  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly gameId = signal(this.data.game);

  handleDialogClick() {
    this.dialogRef.close();
  }
}
