import { TestBed } from '@angular/core/testing';
import { Logout } from './logout';
import { provideTranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../../authentication/auth.service';
import { provideRouter, Router } from '@angular/router';

describe('Logout', () => {

  it('should create',async () => {
    const { component } = await setup();
    expect(component).toBeTruthy();
  });

  it('should logout on init', async () => {
    const { fixture, authServiceMock } = await setup();
    fixture.detectChanges();
    expect(authServiceMock.logout).toHaveBeenCalledOnce();
  });

  it('should navigate to home after logout', async () => {
    const { fixture, authServiceMock, routerMock } = await setup();
    const navigateSpy = vi.spyOn(routerMock, 'navigate').mockResolvedValue(true);
    fixture.detectChanges();
    expect(authServiceMock.logout).toHaveBeenCalledOnce();
    expect(navigateSpy).toHaveBeenCalledWith(['/home']);
  });

  it('should render the spinner', async () => {
    const { fixture } = await setup();
    fixture.detectChanges();
    const spinner = fixture.nativeElement.querySelector('mat-spinner');
    expect(spinner).toBeTruthy();
  });

  it('should render the signing out message', async () => {
    const { fixture } = await setup();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Signing you out…');
  });
});

async function setup() {
  const authServiceMock = {
    logout: vi.fn()
  }

  const routerMock = {
    navigate: vi.fn(),
  };

  await TestBed.configureTestingModule({
    imports: [Logout],
    providers: [
      provideTranslateService(),
      { provide: AuthService, useValue: authServiceMock },
      { provide: Router, useValue: routerMock },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(Logout);
  const component = fixture.componentInstance;
  fixture.detectChanges();

  return {
    fixture,
    component,
    authServiceMock,
    routerMock,
  };
}
