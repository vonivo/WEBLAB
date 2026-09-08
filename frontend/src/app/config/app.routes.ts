import { Routes } from '@angular/router';
import { Login } from '../features/user/smart_containers/login/login';
import { PATHS } from './paths.config';
import { TeamOverview } from '../features/team/pages/team-overview/team-overview';
import { TeamDetail } from '../features/team/pages/team-detail/team-detail';
import { authGuard } from '../authentication/guards/auth.guard';
import { anonymousGuard } from '../authentication/guards/anonymous.guard';
import { Logout } from '../features/user/smart_containers/logout/logout';

const { HOME, LOGIN, TEAMS, LOGOUT } = PATHS;

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
