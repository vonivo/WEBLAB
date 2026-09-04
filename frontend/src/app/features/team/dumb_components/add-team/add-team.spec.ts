import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddTeam } from './add-team';
import { provideTranslateService } from '@ngx-translate/core';

describe('AddTeam', () => {
  let component: AddTeam;
  let fixture: ComponentFixture<AddTeam>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTeam],
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(AddTeam);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
