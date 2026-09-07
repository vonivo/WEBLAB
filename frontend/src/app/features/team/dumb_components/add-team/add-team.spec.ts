import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddTeam } from './add-team';
import { provideTranslateService } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';

describe('AddTeam', () => {
  it('should create', async () => {
    const { component } = await setup();
    expect(component).toBeTruthy();
  });

  it('should render errors form is invalid', async () => {
    const { component, fixture } = await setup();
    const submitSpy = vi.spyOn(component.onFormSubmit, 'emit');

    const submitButton = fixture.debugElement.query(By.css('[data-testid=SUBMIT_ADD_TEAM'));
    (submitButton.nativeElement as HTMLButtonElement).click(); // native click to trigger form submission
    fixture.detectChanges();

    const errorElements = fixture.debugElement.queryAll(By.css('mat-error'));
    expect(errorElements.length).toEqual(2);
  });

  it('should not emit onFormSubmit if form is invalid', async () => {
    const { component, fixture } = await setup();
    const submitSpy = vi.spyOn(component.onFormSubmit, 'emit');

    const submitButton = fixture.debugElement.query(By.css('[data-testid=SUBMIT_ADD_TEAM'));
    (submitButton.nativeElement as HTMLButtonElement).click(); // native click to trigger form submission
    fixture.detectChanges();

    expect(submitSpy).not.toHaveBeenCalled();
  });

  it('should emit onFormSubmit if form is valid', async () => {
    const { component, fixture } = await setup();
    const submitSpy = vi.spyOn(component.onFormSubmit, 'emit');

    component.addTeamForm.name().value.set('Team Name');
    component.addTeamForm.logoUrl().value.set('https://someLogoUrl.exmpale.com');
    fixture.detectChanges();

    const submitButton = fixture.debugElement.query(By.css('[data-testid=SUBMIT_ADD_TEAM'));
    (submitButton.nativeElement as HTMLButtonElement).click(); // native click to trigger form submission
    expect(submitSpy).toHaveBeenCalledTimes(1);
  });
});

async function setup() {
  await TestBed.configureTestingModule({
    imports: [AddTeam],
    providers: [provideTranslateService()],
  }).compileComponents();

  const fixture = TestBed.createComponent(AddTeam);
  const component = fixture.componentInstance;
  fixture.detectChanges();

  return { component, fixture };
}
