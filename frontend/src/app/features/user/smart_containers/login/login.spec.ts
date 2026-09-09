import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { describe, expect, it, vi } from 'vitest';
import { Login } from './login';
import { WebauthnService } from '../../services/webautn.service';

describe('Login', () => {
  it('should create', async () => {
    const { component } = await setup();

    expect(component).toBeTruthy();
  });

  describe('handleRegistration', () => {
    it('should navigate to home when registration is verified', async () => {
      const { component, webauthnServiceMock, routerMock } = await setup();

      webauthnServiceMock.register.mockResolvedValue(true);

      await component.handleRegistration('alice');

      expect(webauthnServiceMock.register).toHaveBeenCalledOnce();
      expect(webauthnServiceMock.register).toHaveBeenCalledWith('alice');
      expect(routerMock.navigate).toHaveBeenCalledOnce();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
    });

    it('should not navigate when registration is not verified', async () => {
      const { component, webauthnServiceMock, routerMock } = await setup();

      webauthnServiceMock.register.mockResolvedValue(false);

      await component.handleRegistration('alice');

      expect(webauthnServiceMock.register).toHaveBeenCalledWith('alice');
      expect(routerMock.navigate).not.toHaveBeenCalled();
    });

    it('should show registration failed message when registration throws', async () => {
      const { component, webauthnServiceMock, routerMock, snackBarMock, translateServiceMock } =
        await setup();

      webauthnServiceMock.register.mockRejectedValue(new Error('Registration failed'));

      await component.handleRegistration('alice');

      expect(translateServiceMock.translate).toHaveBeenCalledWith('login.registrationFailed');

      expect(snackBarMock.open).toHaveBeenCalledOnce();
      expect(snackBarMock.open).toHaveBeenCalledWith('Registration failed', 'Close');

      expect(routerMock.navigate).not.toHaveBeenCalled();
    });
  });

  describe('handleLogin', () => {
    it('should navigate to home when login is verified', async () => {
      const { component, webauthnServiceMock, routerMock } = await setup();

      webauthnServiceMock.login.mockResolvedValue(true);

      await component.handleLogin('alice');

      expect(webauthnServiceMock.login).toHaveBeenCalledOnce();
      expect(webauthnServiceMock.login).toHaveBeenCalledWith('alice');
      expect(routerMock.navigate).toHaveBeenCalledOnce();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
    });

    it('should not navigate when login is not verified', async () => {
      const { component, webauthnServiceMock, routerMock } = await setup();

      webauthnServiceMock.login.mockResolvedValue(false);

      await component.handleLogin('alice');

      expect(webauthnServiceMock.login).toHaveBeenCalledWith('alice');
      expect(routerMock.navigate).not.toHaveBeenCalled();
    });

    it('should show login failed message when login throws', async () => {
      const { component, webauthnServiceMock, routerMock, snackBarMock, translateServiceMock } =
        await setup();

      webauthnServiceMock.login.mockRejectedValue(new Error('Login failed'));

      await component.handleLogin('alice');

      expect(translateServiceMock.translate).toHaveBeenCalledWith('login.loginFailed');

      expect(snackBarMock.open).toHaveBeenCalledOnce();
      expect(snackBarMock.open).toHaveBeenCalledWith('Login failed', 'Close');

      expect(routerMock.navigate).not.toHaveBeenCalled();
    });
  });
});

async function setup() {
  const webauthnServiceMock = {
    register: vi.fn(),
    login: vi.fn(),
  };

  const routerMock = {
    navigate: vi.fn(),
  };

  const snackBarMock = {
    open: vi.fn(),
  };

  const translateServiceMock = {
    translate: vi.fn((key: string) => {
      const translations: Record<string, () => string> = {
        'login.registrationFailed': () => 'Registration failed',
        'login.loginFailed': () => 'Login failed',
        'generic.close': () => 'Close',
      };

      return translations[key];
    }),
  };

  await TestBed.configureTestingModule({
    imports: [Login],
    providers: [
      {
        provide: WebauthnService,
        useValue: webauthnServiceMock,
      },
      {
        provide: Router,
        useValue: routerMock,
      },
      {
        provide: MatSnackBar,
        useValue: snackBarMock,
      },
      {
        provide: TranslateService,
        useValue: translateServiceMock,
      },
    ],
  }).compileComponents();

  const fixture: ComponentFixture<Login> = TestBed.createComponent(Login);

  return {
    fixture,
    component: fixture.componentInstance,
    webauthnServiceMock,
    routerMock,
    snackBarMock,
    translateServiceMock,
  };
}
