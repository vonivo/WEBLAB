describe('Team', () => {
  beforeEach(() => {
    cy.login();
  });

  it('should test create Teams journey', () => {
    cy.visit('/teams');

    const initialTeam: Team = {
      name: 'New Team A',
      logoUrl: 'https://example.com/logo.png',
      players: [],
    };

    createTeam(initialTeam);

    cy.get('[data-testid="TLE_New Team A_EDIT"]').click();

    const newTeamValue: Team = {
      name: 'New Team B',
      logoUrl:
        'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg',
      players: [{ firstname: 'Donald', lastname: 'Duck' }],
    };

    fillInTeamValues(newTeamValue);
    cy.get('[data-testid="TDE_CANCEL"]').click();
    validateTeamValues(initialTeam);

    cy.get('[data-testid="EDIT_TEAM_NAME_INPUT"]').clear();
    cy.get('[data-testid="EDIT_TEAM_LOGO_INPUT"]').clear();
    cy.get('[data-testid="BTN_ADD_PLAYER"]').click();
    cy.get('[data-testid="TDE_SUBMIT"]').click();
    cy.get('mat-error').should('have.length', 4);

    fillInTeamValues(newTeamValue);
    cy.get('mat-error').should('not.exist');
    cy.get('[data-testid="TDE_SUBMIT"]').click();
    cy.get('[data-testid="TDE_SUBMIT"]').should('not.exist');

    validateTeamValues(newTeamValue);
    cy.reload();
    cy.get('[data-testid="TDE_SUBMIT"]').should('not.exist');

    validateTeamValues(newTeamValue);

    cy.get('[data-testid="EDIT_TEAM_PLAYER0_DELETE"]').click();

    validateTeamValues({ ...newTeamValue, players: [] });
    cy.get('[data-testid="TDE_CANCEL"]').click();
    validateTeamValues(newTeamValue);

    cy.get('[data-testid="EDIT_TEAM_PLAYER0_DELETE"]').click();
    cy.get('[data-testid="TDE_SUBMIT"]').click();
    cy.reload();
    validateTeamValues({ ...newTeamValue, players: [] });

    cy.visit('/teams');
    cy.get('[data-testid="TLE_New Team B_DELETE"]').click();
    cy.get('[data-testid="TLE_New Team B"]').should('not.exist');
    cy.reload();
    cy.get('[data-testid="TLE_New Team B"]').should('not.exist');
  });
});

function createTeam(team: Team) {
  cy.visit('/teams');
  cy.get('[data-testid=SUBMIT_ADD_TEAM]').click();
  cy.get('mat-error').should('be.visible');

  cy.get('[data-testid=AT_NAME_INPUT]').type(team.name);
  cy.get('[data-testid=SUBMIT_ADD_TEAM]').click();
  cy.get('mat-error').should('be.visible');

  cy.get('[data-testid="AT_LOGO_URL_INPUT"]').type(team.logoUrl, {
    force: true,
  });
  cy.get('[data-testid=SUBMIT_ADD_TEAM]').click();

  cy.get('[data-testid="TLE_New Team A"]').should('contain.text', 'New Team A');
}

function fillInTeamValues(team: Team, afterInputFilled: () => void = () => {}): void {
  cy.get('[data-testid="EDIT_TEAM_NAME_INPUT"]').type(team.name);
  afterInputFilled();
  cy.get('[data-testid="EDIT_TEAM_LOGO_INPUT"]').type(team.logoUrl);
  afterInputFilled();

  team.players.forEach((player: Player, index: number) => {
    const firstNameInput = `[data-testid="EDIT_TEAM_PLAYER${index}_FIRSTNAME_INPUT"]`;

    cy.get('body').then(($body) => {
      if ($body.find(firstNameInput).length === 0) {
        cy.get('[data-testid="BTN_ADD_PLAYER"]').click();
      }

      cy.get(firstNameInput).type(player.firstname);
      cy.get(`[data-testid="EDIT_TEAM_PLAYER${index}_LASTNAME_INPUT"]`).type(player.lastname);
    });
  });
}

function validateTeamValues(team: Team) {
  cy.get('[data-testid="EDIT_TEAM_NAME_INPUT"]').should('have.value', team.name);
  cy.get('[data-testid="EDIT_TEAM_LOGO_INPUT"]').should('have.value', team.logoUrl);

  if (team.players.length === 0) {
    cy.get('[data-testid="EDIT_TEAM_PLAYER0_FIRSTNAME_INPUT"]').should('not.exist');
  } else {
    team.players.forEach((player: Player, index: number) => {
      cy.get(`[data-testid="EDIT_TEAM_PLAYER${index}_FIRSTNAME_INPUT"]`).should(
        'have.value',
        player.firstname,
      );
      cy.get(`[data-testid="EDIT_TEAM_PLAYER${index}_LASTNAME_INPUT"]`).should(
        'have.value',
        player.lastname,
      );
    });
  }
}

interface Team {
  name: string;
  logoUrl: string;
  players: Player[];
}

interface Player {
  firstname: string;
  lastname: string;
}
