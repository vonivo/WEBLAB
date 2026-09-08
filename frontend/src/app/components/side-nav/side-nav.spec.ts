import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SideNav } from './side-nav';
import { provideTranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { inputBinding, signal } from '@angular/core';
import { NavigationItem, NavigationLinkAccessRole } from '../navigation/navigation.type';
import { By } from '@angular/platform-browser';

describe('SideNav', () => {

  it('should create', async () => {
    const {component} = await setup();
    expect(component).toBeTruthy();
  });

  it('should render Navigation Items', async () => {
    const {fixture} = await setup();
    expect(fixture.nativeElement.querySelectorAll('[data-testid^="SIDE_NAV"]').length).toBe(2);
  });

  it('should bind routerLink to link path', async () => {
    const { fixture } = await setup();
    const aTags = fixture.debugElement.queryAll(By.css('[data-testid^="SIDE_NAV"]'));
    aTags.forEach((aTag, index) => {
      expect(aTag.nativeElement.getAttribute('href')).toBe(
        defaultProps.navigationLinks[index].path,
      );
    });
  });

  it('should emit if navigation link clicked', async () => {
    const { component, fixture } = await setup();
    const emitSpy = vi.spyOn(component.linkItemClicked, 'emit');
    const anchor = fixture.debugElement.query(
      By.css(`[data-testid^="SIDE_NAV_ITEM_${defaultProps.navigationLinks[0].path}"]`),
    );
    anchor.triggerEventHandler('click', {});

    fixture.detectChanges();
    expect(emitSpy).toHaveBeenCalledTimes(1);
  });

  it('should render public navigation items when anonymous', async () => {
    const { fixture } = await setup();
    const publicAnchor = fixture.debugElement.query(
      By.css(`[data-testid="SIDE_NAV_ITEM_${defaultProps.navigationLinks[0].path}"]`),
    );
    expect(publicAnchor).toBeTruthy()
  });

  it('should render public navigation items when logged in', async () => {
    const { fixture } = await setup({currentAccessRole: NavigationLinkAccessRole.LOGGED_IN});
    const publicAnchor = fixture.debugElement.query(
      By.css(`[data-testid="SIDE_NAV_ITEM_${defaultProps.navigationLinks[0].path}"]`),
    );
    expect(publicAnchor).toBeTruthy();
  });

  it('should render logged_in navigation items when logged in', async () => {
    const { fixture } = await setup({
      currentAccessRole: NavigationLinkAccessRole.LOGGED_IN,
    });
    const publicAnchor = fixture.debugElement.query(
      By.css(`[data-testid="SIDE_NAV_ITEM_${defaultProps.navigationLinks[2].path}"]`),
    );
    expect(publicAnchor).toBeTruthy();
  });

  it('should not render anonymous navigation items when logged in', async () => {
    const { fixture } = await setup({
      currentAccessRole: NavigationLinkAccessRole.LOGGED_IN,
    });
    const publicAnchor = fixture.debugElement.query(
      By.css(`[data-testid="SIDE_NAV_ITEM_${defaultProps.navigationLinks[1].path}"]`),
    );
    expect(publicAnchor).toBeFalsy();
  });

  it('should not render logged_in navigation items when anonymous', async () => {
    const { fixture } = await setup({
      currentAccessRole: NavigationLinkAccessRole.ANONYMOUS,
    });
    const publicAnchor = fixture.debugElement.query(
      By.css(`[data-testid="SIDE_NAV_ITEM_${defaultProps.navigationLinks[2].path}"]`),
    );
    expect(publicAnchor).toBeFalsy();
  });

  it('should render anonymous navigation items when anonymous', async () => {
    const { fixture } = await setup({
      currentAccessRole: NavigationLinkAccessRole.ANONYMOUS,
    });
    const publicAnchor = fixture.debugElement.query(
      By.css(`[data-testid="SIDE_NAV_ITEM_${defaultProps.navigationLinks[1].path}"]`),
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
};

async function setup(props: Partial<Props>= {}) {
  const mergedProps = {...defaultProps, ...props};

  await TestBed.configureTestingModule({
    imports: [SideNav],
    providers: [provideTranslateService(), { provide: ActivatedRoute, useValue: {} }],
  }).compileComponents();

  const fixture = TestBed.createComponent(SideNav, {
    bindings: [
      inputBinding('navigationLinks', signal<NavigationItem[]>(mergedProps.navigationLinks)),
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
  currentAccessRole: NavigationLinkAccessRole;
  navigationLinks: NavigationItem[];
}
