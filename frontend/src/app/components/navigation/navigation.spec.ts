import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Navigation } from './navigation';
import { provideTranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { inputBinding, signal } from '@angular/core';
import { NavigationItem, NavigationLinkAccessRole } from './navigation.type';
import { By } from '@angular/platform-browser';

describe('Navigation', () => {
  it('should create', async () => {
    const { component } = await setup();
    expect(component).toBeTruthy();
  });

  it('should render Navigation Items', async () => {
    const { fixture } = await setup();
    expect(fixture.nativeElement.querySelectorAll('[data-testid^="MAIN_NAV_ITEM"]').length).toBe(2);
  });

  it('should bind routerLink to link path', async () => {
    const { fixture } = await setup();
    const aTags = fixture.debugElement.queryAll(By.css('[data-testid^="MAIN_NAV_ITEM"]'));
    aTags.forEach((aTag, index) => {
      expect(aTag.nativeElement.getAttribute('href')).toBe(
        defaultProps.navigationLinks[index].path,
      );
    });
  });

  it('should emit burgerMenu clicked', async () => {
    const { fixture, component } = await setup();
    const emitSpy = vi.spyOn(component.burgerMenuClicked, 'emit');
    const burger = fixture.debugElement.query(By.css('[data-testid=MAIN_NAV_BURGER'));
    burger.triggerEventHandler('click', {});

    expect(emitSpy).toHaveBeenCalledTimes(1);
  });

  it('should show burger when nav drawer is closed', async () => {
    const { fixture } = await setup();
    const burger = fixture.debugElement.query(By.css('[data-testid=MAIN_NAV_BURGER'));
    expect(burger.query(By.css('mat-icon')).nativeElement.textContent).toBe('menu');
  });

  it('should show close icon when nav drawer is openen', async () => {
    const { fixture } = await setup({ navigationSideNavOpen: true });

    const burger = fixture.debugElement.query(By.css('[data-testid=MAIN_NAV_BURGER'));
    expect(burger.query(By.css('mat-icon')).nativeElement.textContent).toBe('close');
  });

  it('should render public navigation items when anonymous', async () => {
    const { fixture } = await setup();
    const publicAnchor = fixture.debugElement.query(
      By.css(`[data-testid="MAIN_NAV_ITEM_${defaultProps.navigationLinks[0].path}"]`),
    );
    expect(publicAnchor).toBeTruthy();
  });

  it('should render public navigation items when logged in', async () => {
    const { fixture } = await setup({ currentAccessRole: NavigationLinkAccessRole.LOGGED_IN });
    const publicAnchor = fixture.debugElement.query(
      By.css(`[data-testid="MAIN_NAV_ITEM_${defaultProps.navigationLinks[0].path}"]`),
    );
    expect(publicAnchor).toBeTruthy();
  });

  it('should render logged_in navigation items when logged in', async () => {
    const { fixture } = await setup({
      currentAccessRole: NavigationLinkAccessRole.LOGGED_IN,
    });
    const publicAnchor = fixture.debugElement.query(
      By.css(`[data-testid="MAIN_NAV_ITEM_${defaultProps.navigationLinks[2].path}"]`),
    );
    expect(publicAnchor).toBeTruthy();
  });

  it('should not render anonymous navigation items when logged in', async () => {
    const { fixture } = await setup({
      currentAccessRole: NavigationLinkAccessRole.LOGGED_IN,
    });
    const publicAnchor = fixture.debugElement.query(
      By.css(`[data-testid="MAIN_NAV_ITEM_${defaultProps.navigationLinks[1].path}"]`),
    );
    expect(publicAnchor).toBeFalsy();
  });

  it('should not render logged_in navigation items when anonymous', async () => {
    const { fixture } = await setup({
      currentAccessRole: NavigationLinkAccessRole.ANONYMOUS,
    });
    const publicAnchor = fixture.debugElement.query(
      By.css(`[data-testid="MAIN_NAV_ITEM_${defaultProps.navigationLinks[2].path}"]`),
    );
    expect(publicAnchor).toBeFalsy();
  });

  it('should render anonymous navigation items when anonymous', async () => {
    const { fixture } = await setup({
      currentAccessRole: NavigationLinkAccessRole.ANONYMOUS,
    });
    const publicAnchor = fixture.debugElement.query(
      By.css(`[data-testid="MAIN_NAV_ITEM_${defaultProps.navigationLinks[1].path}"]`),
    );
    expect(publicAnchor).toBeTruthy();
  });
});

const defaultProps: Props = {
  currentAccessRole: NavigationLinkAccessRole.ANONYMOUS,
  navigationLinks: [
    { path: '/home', label: 'Home', accessRole: NavigationLinkAccessRole.PUBLIC },
    { path: '/login', label: 'Login', accessRole: NavigationLinkAccessRole.ANONYMOUS },
    { path: '/teams', label: 'Teams', accessRole: NavigationLinkAccessRole.LOGGED_IN },
  ],
  navigationSideNavOpen: false,
};

async function setup(props: Partial<Props> = {}) {
  const mergedProps = { ...defaultProps, ...props };
  await TestBed.configureTestingModule({
    imports: [Navigation],
    providers: [provideTranslateService(), { provide: ActivatedRoute, useValue: {} }],
  }).compileComponents();

  const fixture = TestBed.createComponent(Navigation, {
    bindings: [
      inputBinding('navigationLinks', signal<NavigationItem[]>(mergedProps.navigationLinks)),
      inputBinding('navigationSideNavOpen', signal(mergedProps.navigationSideNavOpen)),
      inputBinding(
        'navigationAccessRole',
        signal<NavigationLinkAccessRole>(mergedProps.currentAccessRole),
      ),
    ],
  });

  const component = fixture.componentInstance;
  fixture.detectChanges();

  return {
    fixture,
    component,
  };
}

interface Props {
  navigationLinks: NavigationItem[];
  navigationSideNavOpen: boolean;
  currentAccessRole: NavigationLinkAccessRole;
}
