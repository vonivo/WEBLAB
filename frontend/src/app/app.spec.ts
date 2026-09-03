import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideTranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';

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
