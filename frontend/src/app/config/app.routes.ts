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
import { GameDetailPage } from '../features/game/pages/game-detail-page/game-detail-page.component';
import { AddGame } from '../features/game/smart_containers/add-game/add-game';
import { AddGameEventForm } from '../features/game/dumb_components/add-game-event/add-game-event-form.component';
import { AddGameEvent } from '../features/game/smart_containers/add-game-event/add-game-event';
import { CreateGameEvent } from '../features/game/pages/create-game-event/create-game-event';
import { Home } from '../features/game/smart_containers/home/home';

const { HOME, LOGIN, TEAMS, LOGOUT, GAMES } = PATHS;

export const routes: Routes = [
  { path: HOME.path, component: Home },
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
    children: [
      {
        path: '',
        component: GameOverview,
      },
      {
        path: 'create',
        canActivate: [authGuard],
        component: CreateGame,
      },
      {
        path: ':gameId/event/create',
        canActivate: [authGuard],
        component: CreateGameEvent,
      },
      {
        path: ':gameId',
        component: GameDetailPage,
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
