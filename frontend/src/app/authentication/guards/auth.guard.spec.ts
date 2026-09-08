import { TestBed } from '@angular/core/testing';
import { RedirectCommand, Router } from '@angular/router';
import { describe, expect, it, vi } from 'vitest';

import { authGuard } from './auth.guard';
import { AuthService } from '../auth.service';

describe('authGuard', () => {
  it('should allow logged-in users', () => {
    const { authServiceMock, routerMock } = setup(true);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as never, {} as never),
    );

    expect(result).toBe(true);
    expect(authServiceMock.isLoggedIn).toHaveBeenCalledOnce();
    expect(routerMock.parseUrl).not.toHaveBeenCalled();
  });

  it('should redirect anonymous users to login', () => {
    const { authServiceMock, routerMock, loginUrl } = setup(false);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as never, {} as never),
    );

    expect(authServiceMock.isLoggedIn).toHaveBeenCalledOnce();
    expect(routerMock.parseUrl).toHaveBeenCalledWith('/login');

    expect(result).toEqual(
      new RedirectCommand(loginUrl, {
        skipLocationChange: false,
      }),
    );
  });
});

function setup(isLoggedIn: boolean) {
  const loginUrl = {
    toString: () => '/login',
  } as never;

  const authServiceMock = {
    isLoggedIn: vi.fn().mockReturnValue(isLoggedIn),
  };

  const routerMock = {
    parseUrl: vi.fn().mockReturnValue(loginUrl),
  };

  TestBed.configureTestingModule({
    providers: [
      { provide: AuthService, useValue: authServiceMock },
      { provide: Router, useValue: routerMock },
    ],
  });

  return {
    authServiceMock,
    routerMock,
    loginUrl,
  };
}
