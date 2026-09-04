import { Routes } from '@angular/router';
import { Login } from '../features/user/smart_containers/login/login';
import { PATHS } from './paths.config';
import { TeamList } from '../features/team/smart_containers/team-list/team-list';

const { HOME, LOGIN, TEAMS } = PATHS;

export const routes: Routes = [
  { path: HOME.path, component: Login },
  { path: TEAMS.path, component: TeamList },
  {
    path: LOGIN.path,
    component: Login,
  },
];
