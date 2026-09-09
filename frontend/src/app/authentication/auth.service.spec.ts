import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { AuthService } from './auth.service';
import { JWT } from './auth.types';

describe('AuthService', () => {
  const token: JWT = {
    accessToken: 'access-token',
  } as JWT;

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    const { service } = setup();

    expect(service).toBeTruthy();
  });

  describe('initial state', () => {
    it('should not be logged in when no token is stored', () => {
      const { service } = setup();

      expect(service.isLoggedIn()).toBe(false);
      expect(service.getToken()).toBeNull();
      expect(service.accessToken()).toBeNull();
    });

    it('should load the token from localStorage', () => {
      localStorage.setItem('auth', JSON.stringify(token));

      const { service } = setup();

      expect(service.isLoggedIn()).toBe(true);
      expect(service.getToken()).toEqual(token);
      expect(service.accessToken()).toBe('access-token');
    });

    it('should remove an invalid token from localStorage', () => {
      localStorage.setItem('auth', 'invalid-json');

      const { service } = setup();

      expect(service.isLoggedIn()).toBe(false);
      expect(service.getToken()).toBeNull();
      expect(service.accessToken()).toBeNull();
      expect(localStorage.getItem('auth')).toBeNull();
    });
  });

  describe('setToken', () => {
    it('should set the token', () => {
      const { service } = setup();

      service.setToken(token);

      expect(service.getToken()).toEqual(token);
      expect(service.isLoggedIn()).toBe(true);
      expect(service.accessToken()).toBe('access-token');
    });

    it('should store the token in localStorage', () => {
      const { service } = setup();

      service.setToken(token);

      expect(localStorage.getItem('auth')).toBe(JSON.stringify(token));
    });
  });

  describe('getToken', () => {
    it('should return the current token', () => {
      const { service } = setup();

      service.setToken(token);

      expect(service.getToken()).toEqual(token);
    });

    it('should return null after logout', () => {
      const { service } = setup();

      service.setToken(token);
      service.logout();

      expect(service.getToken()).toBeNull();
    });
  });

  describe('accessToken', () => {
    it('should return the access token', () => {
      const { service } = setup();

      service.setToken(token);

      expect(service.accessToken()).toBe('access-token');
    });

    it('should return null when logged out', () => {
      const { service } = setup();

      expect(service.accessToken()).toBeNull();
    });
  });

  describe('isLoggedIn', () => {
    it('should return true when a token exists', () => {
      const { service } = setup();

      service.setToken(token);

      expect(service.isLoggedIn()).toBe(true);
    });

    it('should return false after logout', () => {
      const { service } = setup();

      service.setToken(token);
      service.logout();

      expect(service.isLoggedIn()).toBe(false);
    });
  });

  describe('logout', () => {
    it('should clear the token', () => {
      const { service } = setup();

      service.setToken(token);
      service.logout();

      expect(service.getToken()).toBeNull();
      expect(service.isLoggedIn()).toBe(false);
      expect(service.accessToken()).toBeNull();
    });

    it('should remove the token from localStorage', () => {
      const { service } = setup();

      service.setToken(token);
      service.logout();

      expect(localStorage.getItem('auth')).toBeNull();
    });
  });
});

function setup() {
  TestBed.configureTestingModule({
    providers: [AuthService],
  });

  const service = TestBed.inject(AuthService);

  return {
    service,
  };
}
