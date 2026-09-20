describe('Registration process', () => {
  before(() => {
    cy.createVirtualAuthenticator();
  });

  it('register new pass key, login and logout', () => {
    const username = `testuser_${Cypress._.random(100000, 999999)}`;
    register(username);

    logout();

    login(username);

    logout();
  });
});

function register(username: string) {
  cy.visit('/login');
  cy.get('[data-testid=LF_REGISTER_BTN]').click();
  cy.get('mat-error').should('be.visible');

  cy.get('[data-testid=LF_USERNAME_INPUT]').type(username);
  cy.get('[data-testid=LF_REGISTER_BTN]').click();

  cy.location().should((loc) => {
    expect(loc.pathname).to.eq('/home');
  });
}

function logout() {
  cy.get('[data-testid=MAIN_NAV_ITEM_logout]').click();
  cy.location().should((loc) => {
    expect(loc.pathname).to.eq('/home');
  });
  cy.get('[data-testid=MAIN_NAV_ITEM_login]').should('be.visible');
}

function login(username: string) {
  cy.visit('/login');
  cy.get('[data-testid=LF_LOGIN_BTN]').click();
  cy.get('mat-error').should('be.visible');

  cy.get('[data-testid=LF_USERNAME_INPUT]').type(username);
  cy.get('[data-testid=LF_LOGIN_BTN]').click();

  cy.location().should((loc) => {
    expect(loc.pathname).to.eq('/home');
  });
}
