describe('Registration process', () => {
  before(() => {
    cy.createVirtualAuthenticator();
  });

  it('register new pass key, login and logout', () => {
    cy.visit('/login');

    // Register new login
    cy.get('[data-testid=LF_REGISTER_BTN]').click();
    cy.get('mat-error').should('be.visible');

    cy.get('[data-testid=LF_USERNAME_INPUT]').type('newUsername');
    cy.get('[data-testid=LF_REGISTER_BTN]').click();

    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/home');
    });

    // logout
    cy.get('[data-testid=MAIN_NAV_ITEM_logout]').click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/home');
    });
    cy.get('[data-testid=MAIN_NAV_ITEM_login]').should('be.visible');

    // login again
    cy.visit('/login');
    cy.get('[data-testid=LF_LOGIN_BTN]').click();
    cy.get('mat-error').should('be.visible');

    cy.get('[data-testid=LF_USERNAME_INPUT]').type('newUsername');
    cy.get('[data-testid=LF_LOGIN_BTN]').click();

    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/home');
    });
    cy.get('[data-testid=MAIN_NAV_ITEM_logout]').click();
  });
});
