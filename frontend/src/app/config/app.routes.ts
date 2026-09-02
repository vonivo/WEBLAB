import { Routes } from '@angular/router';
import { Login } from '../features/user/smart_containers/login/login';
import { PATHS } from './paths.config';

const { HOME, LOGIN } = PATHS;

export const routes: Routes = [
  { path: HOME.path, component: Login },
  {
    path: LOGIN.path,
    component: Login,
  },
];
