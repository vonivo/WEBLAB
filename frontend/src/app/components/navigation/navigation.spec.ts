import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Navigation } from './navigation';
import {provideTranslateService} from '@ngx-translate/core';
import {ActivatedRoute} from '@angular/router';
import {inputBinding, signal} from '@angular/core';
import {NavigationItem} from './navigation.type';

describe('Navigation', () => {
  let component: Navigation;
  let fixture: ComponentFixture<Navigation>;

  beforeEach(async () => {
    const {createdComponent, createdFixture} = await setup();

    component = createdComponent;
    fixture = createdFixture;

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

async function setup() {
  await TestBed.configureTestingModule({
    imports: [Navigation],
    providers: [
      provideTranslateService(), {    provide: ActivatedRoute,
        useValue: {}}
    ]
  }).compileComponents();

  const createdFixture = TestBed.createComponent(Navigation, {
    bindings: [
      inputBinding('navigationLinks', signal<NavigationItem[]>([])),
      inputBinding('navigationSideNavOpen', signal(false)),
    ]
  })

  const createdComponent = createdFixture.componentInstance;
  createdFixture.detectChanges()

  return {
    createdFixture,
    createdComponent,
  }
}
