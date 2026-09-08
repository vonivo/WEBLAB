import { Component, computed, inject, signal, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navigation } from './components/navigation/navigation';
import { PATHS } from './config/paths.config';
import { MatDrawer, MatDrawerContainer } from '@angular/material/sidenav';
import { SideNav } from './components/side-nav/side-nav';
import { AuthService } from './authentication/auth.service';
import { NavigationLinkAccessRole } from './components/navigation/navigation.type';

@Component({
  imports: [RouterOutlet, Navigation, MatDrawerContainer, MatDrawer, SideNav],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly authService = inject(AuthService);

  @ViewChild('drawer', { static: true }) public drawer!: MatDrawer;

  navigationSideNavOpen = signal(false);
  navigationAccessRole = computed(() => {
    return this.authService.isLoggedIn()
      ? NavigationLinkAccessRole.LOGGED_IN
      : NavigationLinkAccessRole.ANONYMOUS;
  });

  getAvailableLinks() {
    return Object.values(PATHS);
  }
}
