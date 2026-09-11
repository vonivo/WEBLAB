import { Routes } from '@angular/router';
import { PATHS } from './paths.config';
import { authGuard } from '../authentication/guards/auth.guard';
import { anonymousGuard } from '../authentication/guards/anonymous.guard';

const { HOME, LOGIN, TEAMS, LOGOUT, GAMES } = PATHS;

export const routes: Routes = [
  {
    path: HOME.path,
    loadComponent: () => import('../features/game/smart_containers/home/home').then((m) => m.Home),
  },
  {
    path: TEAMS.path,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('../features/team/pages/team-overview/team-overview').then((m) => m.TeamOverview),
      },
      {
        path: ':teamId',
        loadComponent: () =>
          import('../features/team/pages/team-detail/team-detail').then((m) => m.TeamDetail),
      },
    ],
  },
  {
    path: GAMES.path,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('../features/game/pages/game-overview/game-overview').then((m) => m.GameOverview),
      },
      {
        path: 'create',
        canActivate: [authGuard],
        loadComponent: () =>
          import('../features/game/pages/create-game/create-game').then((m) => m.CreateGame),
      },
      {
        path: ':gameId/event/create',
        canActivate: [authGuard],
        loadComponent: () =>
          import('../features/game/pages/create-game-event/create-game-event').then(
            (m) => m.CreateGameEvent,
          ),
      },
      {
        path: ':gameId',
        loadComponent: () =>
          import('../features/game/pages/game-detail-page/game-detail-page.component').then(
            (m) => m.GameDetailPage,
          ),
      },
    ],
  },
  {
    path: LOGIN.path,
    loadComponent: () =>
      import('../features/user/smart_containers/login/login').then((m) => m.Login),
    canActivate: [anonymousGuard],
  },
  {
    path: LOGOUT.path,
    loadComponent: () =>
      import('../features/user/smart_containers/logout/logout').then((m) => m.Logout),
    canActivate: [authGuard],
  },
];
