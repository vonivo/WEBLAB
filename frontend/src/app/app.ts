import { Component, signal, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navigation } from './components/navigation/navigation';
import { PATHS } from './config/paths.config';
import { MatDrawer, MatDrawerContainer } from '@angular/material/sidenav';

@Component({
  imports: [RouterOutlet, Navigation, MatDrawerContainer, MatDrawer],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  @ViewChild('drawer', { static: true }) public drawer!: MatDrawer;

  navigationSideNavOpen = signal(false);

  getAvailableLinks() {
    return Object.values(PATHS);
  }
}
