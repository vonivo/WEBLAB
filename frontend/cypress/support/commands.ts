export {};

declare global {
  namespace Cypress {
    interface Chainable {
      createVirtualAuthenticator(): Chainable<void>;
      login(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('login', () => {
  cy.createVirtualAuthenticator();

  cy.session(
    'loginSession',
    () => {
      cy.visit('/login');

      cy.get('[data-testid=LF_USERNAME_INPUT]').type('newUsername');
      cy.get('[data-testid=LF_REGISTER_BTN]').click();
    },
    {
      validate() {
        cy.get('[data-testid=MAIN_NAV_ITEM_logout]').should('be.visible');
      },
    },
  );
});

Cypress.Commands.add('createVirtualAuthenticator', () => {
  cy.then(() => {
    // Clear any authenticator left over from a previous run/session on this tab.
    return Cypress.automation('remote:debugger:protocol', {
      command: 'WebAuthn.disable',
      params: {},
    }).catch(() => {
      // Ignore — it just means WebAuthn wasn't enabled yet.
    });
  })
    .then(() => {
      return Cypress.automation('remote:debugger:protocol', {
        command: 'WebAuthn.enable',
        params: {},
      });
    })
    .then(() => {
      return Cypress.automation('remote:debugger:protocol', {
        command: 'WebAuthn.addVirtualAuthenticator',
        params: {
          options: {
            protocol: 'ctap2',
            transport: 'internal',
            hasResidentKey: true,
            hasUserVerification: true,
            isUserVerified: true,
            automaticPresenceSimulation: true,
          },
        },
      });
    });
});
