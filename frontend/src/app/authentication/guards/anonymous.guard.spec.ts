import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';

import { anonymousGuard } from './anonymous.guard';
import { AuthService } from '../auth.service';

describe('anonymousGuard', () => {
  it('should allow anonymous users', () => {
    const { authServiceMock } = setup(false);

    const result = TestBed.runInInjectionContext(() =>
      anonymousGuard(
        {} as never,
        {} as never,
      ),
    );

    expect(result).toBe(true);
    expect(authServiceMock.isLoggedIn).toHaveBeenCalledOnce();
  });

  it('should deny logged-in users', () => {
    const { authServiceMock } = setup(true);

    const result = TestBed.runInInjectionContext(() =>
      anonymousGuard(
        {} as never,
        {} as never,
      ),
    );

    expect(result).toBe(false);
    expect(authServiceMock.isLoggedIn).toHaveBeenCalledOnce();
  });
});

function setup(isLoggedIn: boolean) {
  const authServiceMock = {
    isLoggedIn: vi.fn().mockReturnValue(isLoggedIn),
  };

  TestBed.configureTestingModule({
    providers: [
      {
        provide: AuthService,
        useValue: authServiceMock,
      },
    ],
  });

  return {
    authServiceMock,
  };
}
