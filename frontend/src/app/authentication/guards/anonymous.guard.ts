import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
  RedirectCommand,
} from '@angular/router';
import { AuthService } from '../auth.service';
import { inject } from '@angular/core';

export const anonymousGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const authService = inject(AuthService);

  return !authService.isLoggedIn();
};
