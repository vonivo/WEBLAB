import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';
import { JWT } from './auth.types';

describe('authInterceptor', () => {
  const url = '/api/data';

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
    vi.restoreAllMocks();
  });

  describe('without token', () => {
    it('should not add an Authorization header', () => {
      const { http, httpTesting } = setup(null);

      http.get(url).subscribe();

      const req = httpTesting.expectOne(url);
      expect(req.request.headers.has('Authorization')).toBe(false);
      req.flush({});
    });

    it('should not log out', () => {
      const { http, httpTesting, authService } = setup(null);

      http.get(url).subscribe();
      httpTesting.expectOne(url).flush({});

      expect(authService.logout).not.toHaveBeenCalled();
    });
  });

  describe('with valid token', () => {
    it('should add the Authorization header', () => {
      const accessToken = createJwt(futureExp());
      const { http, httpTesting } = setup({ accessToken } as JWT);

      http.get(url).subscribe();

      const req = httpTesting.expectOne(url);
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${accessToken}`);
      req.flush({});
    });

    it('should not log out', () => {
      const { http, httpTesting, authService } = setup({
        accessToken: createJwt(futureExp()),
      } as JWT);

      http.get(url).subscribe();
      httpTesting.expectOne(url).flush({});

      expect(authService.logout).not.toHaveBeenCalled();
    });
  });

  describe('with expired token', () => {
    it('should log out', () => {
      const { http, httpTesting, authService } = setup({
        accessToken: createJwt(pastExp()),
      } as JWT);

      http.get(url).subscribe();
      httpTesting.expectOne(url).flush({});

      expect(authService.logout).toHaveBeenCalledTimes(1);
    });

    it('should still send the request with the Authorization header', () => {
      const accessToken = createJwt(pastExp());
      const { http, httpTesting } = setup({ accessToken } as JWT);

      http.get(url).subscribe();

      const req = httpTesting.expectOne(url);
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${accessToken}`);
      req.flush({});
    });
  });

  describe('with non-JWT token', () => {
    it('should not log out and still add the header', () => {
      const { http, httpTesting, authService } = setup({ accessToken: 'access-token' } as JWT);

      http.get(url).subscribe();

      const req = httpTesting.expectOne(url);
      expect(req.request.headers.get('Authorization')).toBe('Bearer access-token');
      req.flush({});

      expect(authService.logout).not.toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should log an error, log out and rethrow on 401', () => {
      const { http, httpTesting, authService } = setup({
        accessToken: createJwt(futureExp()),
      } as JWT);
      const onError = vi.fn();

      http.get(url).subscribe({ error: onError });
      httpTesting.expectOne(url).flush('', { status: 401, statusText: 'Unauthorized' });

      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(expect.stringContaining('401'));
      expect(authService.logout).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError.mock.calls[0][0].status).toBe(401);
    });

    it('should rethrow other errors without logging or logging out', () => {
      const { http, httpTesting, authService } = setup({
        accessToken: createJwt(futureExp()),
      } as JWT);
      const onError = vi.fn();

      http.get(url).subscribe({ error: onError });
      httpTesting.expectOne(url).flush('', { status: 500, statusText: 'Server Error' });

      expect(console.error).not.toHaveBeenCalled();
      expect(authService.logout).not.toHaveBeenCalled();
      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError.mock.calls[0][0].status).toBe(500);
    });
  });
});

function futureExp(): number {
  return Math.floor(Date.now() / 1000) + 3600;
}

function pastExp(): number {
  return Math.floor(Date.now() / 1000) - 3600;
}

function createJwt(exp: number): string {
  const payload = btoa(JSON.stringify({ exp }))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `header.${payload}.signature`;
}

function setup(token: JWT | null) {
  const authService = {
    getToken: vi.fn().mockReturnValue(token),
    logout: vi.fn(),
  };

  TestBed.configureTestingModule({
    providers: [
      provideHttpClient(withInterceptors([authInterceptor])),
      provideHttpClientTesting(),
      { provide: AuthService, useValue: authService },
    ],
  });

  return {
    http: TestBed.inject(HttpClient),
    httpTesting: TestBed.inject(HttpTestingController),
    authService,
  };
}
