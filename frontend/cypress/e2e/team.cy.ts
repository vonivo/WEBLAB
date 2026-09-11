describe('Team', () => {
  beforeEach(() => {
    cy.login();
  });

  it('should test create Teams journey', () => {
    cy.visit('/teams');

    cy.get('[data-testid=SUBMIT_ADD_TEAM]').click();
    cy.get('mat-error').should('be.visible');

    cy.get('[data-testid=AT_NAME_INPUT]').type('New Team A');
    cy.get('[data-testid=SUBMIT_ADD_TEAM]').click();
    cy.get('mat-error').should('be.visible');

    cy.get('[data-testid="AT_LOGO_URL_INPUT"]').type('https://example.com/logo.png', {
      force: true,
    });
    cy.get('[data-testid=SUBMIT_ADD_TEAM]').click();

    cy.get('[data-testid="TLE_New Team A"]').should('contain.text', 'New Team A');
    cy.get('[data-testid="TLE_New Team A_EDIT"]').click();

    cy.get('[data-testid="EDIT_TEAM_NAME_INPUT"]').type('New Team B');
    cy.get('[data-testid="EDIT_TEAM_LOGO_INPUT"]').type(
      'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg',
    );

    cy.get('[data-testid="BTN_ADD_PLAYER"]').click();
    cy.get('[data-testid="EDIT_TEAM_PLAYER0_FIRSTNAME_INPUT"]').type('Donald');
    cy.get('[data-testid="EDIT_TEAM_PLAYER0_LASTNAME_INPUT"]').type('Duck');

    cy.get('[data-testid="TDE_CANCEL"]').click();
    cy.get('[data-testid="EDIT_TEAM_NAME_INPUT"]').should('have.value', 'New Team A');
    cy.get('[data-testid="EDIT_TEAM_LOGO_INPUT"]').should(
      'have.value',
      'https://example.com/logo.png',
    );

    cy.get('[data-testid="EDIT_TEAM_NAME_INPUT"]').clear();
    cy.get('[data-testid="EDIT_TEAM_LOGO_INPUT"]').clear();
    cy.get('[data-testid="BTN_ADD_PLAYER"]').click();
    cy.get('[data-testid="TDE_SUBMIT"]').click();

    cy.get('mat-error').should('be.visible');
    cy.get('[data-testid="EDIT_TEAM_NAME_INPUT"]').type('New Team B');
    cy.get('mat-error').should('be.visible');
    cy.get('[data-testid="EDIT_TEAM_LOGO_INPUT"]').type(
      'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg',
    );
    cy.get('mat-error').should('be.visible');
    cy.get('[data-testid="EDIT_TEAM_PLAYER0_FIRSTNAME_INPUT"]').type('Donald');
    cy.get('mat-error').should('be.visible');
    cy.get('[data-testid="EDIT_TEAM_PLAYER0_LASTNAME_INPUT"]').type('Duck');
    cy.get('mat-error').should('not.exist');
    cy.get('[data-testid="TDE_SUBMIT"]').click();

    cy.get('[data-testid="TDE_SUBMIT"]').should('not.exist');
    cy.get('[data-testid="EDIT_TEAM_NAME_INPUT"]').should('have.value', 'New Team B');
    cy.get('[data-testid="EDIT_TEAM_LOGO_INPUT"]').should(
      'have.value',
      'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg',
    );
    cy.get('[data-testid="EDIT_TEAM_PLAYER0_FIRSTNAME_INPUT"]').should('have.value', 'Donald');
    cy.get('[data-testid="EDIT_TEAM_PLAYER0_LASTNAME_INPUT"]').should('have.value', 'Duck');

    cy.reload();
    cy.get('[data-testid="TDE_SUBMIT"]').should('not.exist');
    cy.get('[data-testid="EDIT_TEAM_NAME_INPUT"]').should('have.value', 'New Team B');
    cy.get('[data-testid="EDIT_TEAM_LOGO_INPUT"]').should(
      'have.value',
      'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg',
    );
    cy.get('[data-testid="EDIT_TEAM_PLAYER0_FIRSTNAME_INPUT"]').should('have.value', 'Donald');
    cy.get('[data-testid="EDIT_TEAM_PLAYER0_LASTNAME_INPUT"]').should('have.value', 'Duck');

    cy.get('[data-testid="EDIT_TEAM_PLAYER0_DELETE"]').click();
    cy.get('[data-testid="EDIT_TEAM_PLAYER0_FIRSTNAME_INPUT"]').should('not.exist');
    cy.get('[data-testid="TDE_CANCEL"]').click();
    cy.get('[data-testid="EDIT_TEAM_PLAYER0_FIRSTNAME_INPUT"]').should('be.visible');

    cy.get('[data-testid="EDIT_TEAM_PLAYER0_DELETE"]').click();
    cy.get('[data-testid="TDE_SUBMIT"]').click();
    cy.reload();
    cy.get('[data-testid="EDIT_TEAM_PLAYER0_FIRSTNAME_INPUT"]').should('not.exist');

    cy.visit('/teams');
    cy.get('[data-testid="TLE_New Team B_DELETE"]').click();
    cy.get('[data-testid="TLE_New Team B"]').should('not.exist');
    cy.reload();
    cy.get('[data-testid="TLE_New Team B"]').should('not.exist');
  });
});
