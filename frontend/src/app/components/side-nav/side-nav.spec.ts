import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SideNav } from './side-nav';
import { provideTranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { inputBinding, signal } from '@angular/core';
import { NavigationItem } from '../navigation/navigation.type';
import { By } from '@angular/platform-browser';

describe('SideNav', () => {
  let component: SideNav;
  let fixture: ComponentFixture<SideNav>;

  beforeEach(async () => {
    const { createdComponent, createdFixture } = await setup();

    component = createdComponent;
    fixture = createdFixture;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render Navigation Items', () => {
    expect(fixture.nativeElement.querySelectorAll('[data-testid^="SIDE_NAV"]').length).toBe(
      defaultProps.navigationLinks.length,
    );
  });

  it('should bind routerLink to link path', () => {
    const aTags = fixture.debugElement.queryAll(By.css('[data-testid^="SIDE_NAV"]'));
    aTags.forEach((aTag, index) => {
      expect(aTag.nativeElement.getAttribute('href')).toBe(
        defaultProps.navigationLinks[index].path,
      );
    });
  });

  it('should emit if navigation link clicked', () => {
    const emitSpy = vi.spyOn(component.linkItemClicked, 'emit');
    const anchor = fixture.debugElement.query(
      By.css(`[data-testid^="SIDE_NAV_ITEM_${defaultProps.navigationLinks[0].path}"]`),
    );
    anchor.triggerEventHandler('click', {});

    fixture.detectChanges();
    expect(emitSpy).toHaveBeenCalledTimes(1);
  });
});

const defaultProps = {
  navigationLinks: [
    { path: '/home', label: 'Home' },
    { path: '/login', label: 'Login' },
  ],
};

async function setup() {
  await TestBed.configureTestingModule({
    imports: [SideNav],
    providers: [provideTranslateService(), { provide: ActivatedRoute, useValue: {} }],
  }).compileComponents();

  const createdFixture = TestBed.createComponent(SideNav, {
    bindings: [
      inputBinding('navigationLinks', signal<NavigationItem[]>(defaultProps.navigationLinks)),
    ],
  });

  const createdComponent = createdFixture.componentInstance;
  createdFixture.detectChanges();

  return {
    createdFixture,
    createdComponent,
  };
}
