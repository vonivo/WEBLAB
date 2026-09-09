import { TestBed } from '@angular/core/testing';
import { TeamDetailEdit } from './team-detail-edit';
import { provideTranslateService } from '@ngx-translate/core';
import { Team } from '../../../../core/types/team.types';
import { inputBinding, signal } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('TeamDetailEdit', () => {
  it('should create', async () => {
    const { component } = await setup();
    expect(component).toBeTruthy();
  });

  it('should render skeleton if loading', async () => {
    const { fixture } = await setup({ isLoading: true });
    const skeletons = fixture.debugElement.queryAll(By.css('app-skeleton-loader'));
    expect(skeletons.length).toBeGreaterThan(1);
  });

  it('should not render skeletons if finished loading', async () => {
    const { component, fixture } = await setup({ isLoading: false });
    let skeletons = fixture.debugElement.queryAll(By.css('app-skeleton-loader'));

    expect(skeletons.length).toEqual(0);
  });

  it('should initialize the edit model from the team input', async () => {
    const { component } = await setup();

    expect(component.editTeamModel()).toEqual({
      name: 'Riverside Rovers',
      logoUrl: 'logoUrl',
      players: [expect.objectContaining({ firstname: 'Trick', lastname: 'Duck' })],
    });
  });

  it('should render the team name', async () => {
    const { fixture } = await setup();
    const input = fixture.debugElement.query(By.css('[data-testid=EDIT_TEAM_NAME_INPUT]'))
      .nativeElement as HTMLInputElement;
    expect(input.value).toBe('Riverside Rovers');
  });

  it('should render existing players', async () => {
    const { fixture } = await setup();
    const firstNameInput = fixture.debugElement.query(
      By.css('[data-testid=EDIT_TEAM_PLAYER0_FIRSTNAME_INPUT]'),
    ).nativeElement as HTMLInputElement;
    const lastNameInput = fixture.debugElement.query(
      By.css('[data-testid=EDIT_TEAM_PLAYER0_LASTNAME_INPUT]'),
    ).nativeElement as HTMLInputElement;

    expect(firstNameInput.value).toBe('Trick');
    expect(lastNameInput.value).toBe('Duck');
  });

  it('should add a player', async () => {
    const { component, fixture } = await setup();
    component.addPlayer();
    fixture.detectChanges();
    expect(component.editTeamModel().players).toEqual([
      expect.objectContaining({ firstname: 'Trick', lastname: 'Duck' }),
      expect.objectContaining({
        firstname: '',
        lastname: '',
      }),
    ]);
  });

  it('should render an added player', async () => {
    const { fixture } = await setup();
    const addButton = fixture.debugElement.query(By.css('[data-testid=BTN_ADD_PLAYER]'));
    addButton.triggerEventHandler('click');
    fixture.detectChanges();

    const playerInputs = fixture.debugElement.queryAll(
      By.css('[data-testid=EDIT_TEAM_PLAYER1_LASTNAME_INPUT]'),
    );
    expect(playerInputs.length).toBeTruthy();
  });

  it('should remove a player', async () => {
    const { component, fixture } = await setup();

    component.removePlayer(0);
    fixture.detectChanges();

    expect(component.editTeamModel().players).toEqual([]);
  });

  it('should show the empty players state when all players are removed', async () => {
    const { component, fixture } = await setup();

    component.removePlayer(0);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No players');
    expect(fixture.nativeElement.textContent).toContain('Add a player to this team.');
  });

  it('should mark the form as touched when a player is removed', async () => {
    const { component } = await setup();

    expect(component.editTeamForm().touched()).toBe(false);
    component.removePlayer(0);
    expect(component.editTeamForm().touched()).toBe(true);
  });

  it('should make the form invalid when the team name is empty', async () => {
    const { component } = await setup();

    component.editTeamForm.name().value.set('');
    expect(component.editTeamForm().valid()).toBe(false);
    expect(component.editTeamForm.name().errors()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: 'generic.required',
        }),
      ]),
    );
  });

  it('should make the form invalid when the logo URL is empty', async () => {
    const { component } = await setup();
    component.editTeamForm.logoUrl().value.set('');
    expect(component.editTeamForm().valid()).toBe(false);
    expect(component.editTeamForm.logoUrl().errors()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: 'generic.required',
        }),
      ]),
    );
  });

  it('should make the form invalid when a player first name is empty', async () => {
    const { component } = await setup();
    component.editTeamForm.players[0].firstname().value.set('');
    expect(component.editTeamForm().valid()).toBe(false);
    expect(component.editTeamForm.players[0].firstname().errors()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: 'generic.required',
        }),
      ]),
    );
  });
  it('should make the form invalid when a player last name is empty', async () => {
    const { component } = await setup();
    component.editTeamForm.players[0].lastname().value.set('');
    expect(component.editTeamForm().valid()).toBe(false);
    expect(component.editTeamForm.players[0].lastname().errors()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: 'generic.required',
        }),
      ]),
    );
  });

  it('should emit the updated team when saving a valid form', async () => {
    const { component } = await setup();
    const emittedTeams: Team[] = [];
    component.teamSaved.subscribe((team) => {
      emittedTeams.push(team);
    });
    component.editTeamForm.name().value.set('New Riverside Rovers');
    component.editTeamForm.logoUrl().value.set('new-logo-url');
    component.save(new Event('submit'));
    expect(emittedTeams).toEqual([
      {
        _id: 'teamId',
        name: 'New Riverside Rovers',
        logoUrl: 'new-logo-url',
        players: [expect.objectContaining({ firstname: 'Trick', lastname: 'Duck' })],
      },
    ]);
  });

  it('should not emit when saving an invalid form', async () => {
    const { component } = await setup();

    const emittedTeams: Team[] = [];

    component.teamSaved.subscribe((team) => {
      emittedTeams.push(team);
    });

    component.editTeamForm.name().value.set('');
    component.save(new Event('submit'));
    expect(emittedTeams).toEqual([]);
  });

  it('should restore the original team when cancelling', async () => {
    const { component } = await setup();

    component.editTeamForm.name().value.set('Changed Team');
    component.editTeamForm.logoUrl().value.set('changed-logo');
    component.addPlayer();
    expect(component.editTeamModel().name).toBe('Changed Team');
    expect(component.editTeamModel().players.length).toBe(2);

    component.cancel();

    expect(component.editTeamModel()).toEqual({
      name: 'Riverside Rovers',
      logoUrl: 'logoUrl',
      players: [expect.objectContaining({ firstname: 'Trick', lastname: 'Duck' })],
    });
  });

  it('should reset the form when cancelling', async () => {
    const { component } = await setup();

    component.editTeamForm.name().value.set('Changed Team');
    component.editTeamForm.logoUrl().value.set('changed-logo');
    component.cancel();

    expect(component.editTeamModel().name).toBe('Riverside Rovers');
    expect(component.editTeamModel().logoUrl).toBe('logoUrl');
  });

  it('should show save and cancel buttons when the form is touched', async () => {
    const { component, fixture } = await setup();

    component.editTeamForm.name().value.set('Changed Team');
    component.editTeamForm.name().markAsTouched();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('generic.cancel');
    expect(fixture.nativeElement.textContent).toContain('generic.save');
  });

  it('should not show save and cancel buttons when the form is untouched', async () => {
    const { fixture } = await setup();

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const submitButton = buttons.find(
      (button) => button.nativeElement.getAttribute('type') === 'submit',
    );

    expect(submitButton).toBeUndefined();
  });
});

const defaultProps: Props = {
  team: {
    _id: 'teamId',
    name: 'Riverside Rovers',
    logoUrl: 'logoUrl',
    players: [
      {
        _id: 'playerId',
        firstname: 'Trick',
        lastname: 'Duck',
      },
    ],
  },
  isLoading: false,
};

async function setup(props: Partial<Props> = {}) {
  const mergedPros = { ...defaultProps, ...props };

  await TestBed.configureTestingModule({
    imports: [TeamDetailEdit],
    providers: [provideTranslateService()],
  }).compileComponents();

  const fixture = TestBed.createComponent(TeamDetailEdit, {
    bindings: [
      inputBinding('team', signal(mergedPros.team)),
      inputBinding('isLoading', signal(mergedPros.isLoading)),
    ],
  });
  const component = fixture.componentInstance;
  fixture.detectChanges();

  return {
    component,
    fixture,
  };
}

interface Props {
  team: Team;
  isLoading: boolean;
}
