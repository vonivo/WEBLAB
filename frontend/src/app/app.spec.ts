import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideTranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { By } from '@angular/platform-browser';

describe('App', () => {
  let component: App;
  let fixture: ComponentFixture<App>;

  beforeEach(async () => {
    const { createdComponent, createdFixture } = await setup();
    component = createdComponent;
    fixture = createdFixture;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle the drawer when burgerMenuClicked is emitted', () => {
    const drawer = fixture.debugElement.query(By.css('mat-drawer')).componentInstance as MatDrawer;
    vi.spyOn(drawer, 'toggle');

    const navigation = fixture.debugElement.query(By.css('app-navigation'));
    navigation.triggerEventHandler('burgerMenuClicked');
    expect(drawer.toggle).toHaveBeenCalled();
  });

  it('should toggle the drawer when a side navigation link is clicked', () => {
    const drawer = fixture.debugElement.query(By.css('mat-drawer')).componentInstance as MatDrawer;
    vi.spyOn(drawer, 'toggle');

    const sideNav = fixture.debugElement.query(By.css('app-side-nav'));
    sideNav.triggerEventHandler('linkItemClicked');
    expect(drawer.toggle).toHaveBeenCalled();
  });

  it('should update navigationSideNavOpen when the drawer opened state changes', () => {
    const drawer = fixture.debugElement.query(By.css('mat-drawer'));
    drawer.triggerEventHandler('openedChange', true);

    expect(component.navigationSideNavOpen()).toBe(true);
    drawer.triggerEventHandler('openedChange', false);
    expect(component.navigationSideNavOpen()).toBe(false);
  });
});

async function setup() {
  await TestBed.configureTestingModule({
    imports: [App],
    providers: [provideTranslateService(), { provide: ActivatedRoute, useValue: {} }],
  }).compileComponents();

  const createdFixture = TestBed.createComponent(App);

  const createdComponent = createdFixture.componentInstance;
  createdFixture.detectChanges();

  return {
    createdFixture,
    createdComponent,
  };
}
