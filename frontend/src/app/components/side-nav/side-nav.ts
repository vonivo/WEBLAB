import { Component, input, output } from '@angular/core';
import { NavigationItem } from '../navigation/navigation.type';
import { MatButton } from '@angular/material/button';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  imports: [MatButton, RouterLinkActive, RouterLink, TranslatePipe],
  selector: 'app-side-nav',
  styleUrl: './side-nav.css',
  templateUrl: './side-nav.html',
})
export class SideNav {
  navigationLinks = input.required<NavigationItem[]>();

  linkItemClicked = output<NavigationItem>();
}
