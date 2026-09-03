import { Component, input, output } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton, MatIconButton } from '@angular/material/button';
import { NavigationItem } from './navigation.type';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  imports: [
    MatToolbar,
    MatButton,
    RouterLink,
    RouterLinkActive,
    TranslatePipe,
    MatIconButton,
    MatIcon,
  ],
  selector: 'app-navigation',
  styleUrl: './navigation.css',
  templateUrl: './navigation.html',
})
export class Navigation {
  navigationLinks = input.required<NavigationItem[]>();
  navigationSideNavOpen = input.required<boolean>();

  burgerMenuClicked = output();

  handleMenuButtonClick() {
    this.burgerMenuClicked.emit();
  }
}
