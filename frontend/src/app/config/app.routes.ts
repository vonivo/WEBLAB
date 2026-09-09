import { Routes } from '@angular/router';
import { Login } from '../features/user/smart_containers/login/login';
import { PATHS } from './paths.config';
import { TeamOverview } from '../features/team/pages/team-overview/team-overview';
import { TeamDetail } from '../features/team/pages/team-detail/team-detail';
import { authGuard } from '../authentication/guards/auth.guard';
import { anonymousGuard } from '../authentication/guards/anonymous.guard';
import { Logout } from '../features/user/smart_containers/logout/logout';
import { GameOverview } from '../features/game/pages/game-overview/game-overview';
import { CreateGame } from '../features/game/pages/create-game/create-game';
import { GameDetail } from '../features/game/pages/game-detail/game-detail';

const { HOME, LOGIN, TEAMS, LOGOUT, GAMES } = PATHS;

export const routes: Routes = [
  { path: HOME.path, component: Login },
  {
    path: TEAMS.path,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: TeamOverview,
      },
      {
        path: ':teamId',
        component: TeamDetail,
      },
    ],
  },
  {
    path: GAMES.path,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: GameOverview,
      },
      {
        path: 'create',
        component: CreateGame,
      },
      {
        path: ':gameId',
        component: GameDetail,
      },
    ],
  },
  {
    path: LOGIN.path,
    component: Login,
    canActivate: [anonymousGuard],
  },
  {
    path: LOGOUT.path,
    component: Logout,
    canActivate: [authGuard],
  },
];
