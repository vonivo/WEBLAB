import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SideNav } from './side-nav';
import { provideTranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { inputBinding, signal } from '@angular/core';
import { NavigationItem } from '../navigation/navigation.type';

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
});

async function setup() {
  await TestBed.configureTestingModule({
    imports: [SideNav],
    providers: [provideTranslateService(), { provide: ActivatedRoute, useValue: {} }],
  }).compileComponents();

  const createdFixture = TestBed.createComponent(SideNav, {
    bindings: [inputBinding('navigationLinks', signal<NavigationItem[]>([]))],
  });

  const createdComponent = createdFixture.componentInstance;
  createdFixture.detectChanges();

  return {
    createdFixture,
    createdComponent,
  };
}
