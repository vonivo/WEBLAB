const gameResourceIdAlias = 'createdGameId';
describe('Team', () => {
  beforeEach(() => {
    cy.login().then(() => {
      cy.window().then((win) => {
        const auth = JSON.parse(win.localStorage.getItem('auth') ?? '');
        // create Teams to test
        cy.request({
          method: 'POST',
          url: '/api/teams',
          body: teamStark,
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }).then((response) => {
          teamStark._id = response.body._id;
          response.body.players.forEach((player, index: number) => {
            teamStark.players[index]._id = player._id;
          });
        });

        cy.request({
          method: 'POST',
          url: '/api/teams',
          body: teamLannister,
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }).then((response) => {
          teamLannister._id = response.body._id;
          response.body.players.forEach((player, index: number) => {
            teamLannister.players[index]._id = player._id;
          });
        });
      });
    });
  });

  afterEach(() => {
    cy.visit('/');
    cy.visit('/teams').then(() => {
      cy.get(`[data-testid="TLE_${teamStark.name}_DELETE"]`).click();
      cy.get(`[data-testid="TLE_${teamLannister.name}_DELETE"]`).click();
    });
  });

  it('should test Game journey', () => {
    cy.visit('/games');

    createGame(teamStark, teamLannister);
    cy.get(`@${gameResourceIdAlias}`).then((gameId) => {
      cy.get(`[data-testid=GLE_ENTRY_${gameId}]`).click();
      cy.get('#mat-tab-group-0-label-1').click();
      validateLineups();

      cy.get('#mat-tab-group-0-label-0').click();

      addAndValidateKickoffEvent();

      addStandardEvents();

      addGoalEvents();

      addMatchEndEvent();
    });
  });
});

function addMatchEndEvent() {
  cy.get('[data-testid=GDP_ADD_EVENT_BTN]').click();
  cy.get('[data-testid=AGEF_TYPE_SELECT]').click();
  cy.get('[data-testid=AGEF_TYPE_GAME_END]').click();
  cy.get('[data-testid=AGEF_MINUTE_INPUT]').type('120');
  cy.get('[data-testid=AGEF_SUBMIT_BUTTON]').click();

  cy.get('app-game-detail-timeline').should('contain.text', 'Game end');
  cy.get('app-game-detail-timeline').should('contain.text', "120'");
  cy.get('[data-testid=GDH_STATUS]').should('contain.text', 'finished');

  cy.get(`@${gameResourceIdAlias}`).then((gameId) => {
    cy.visit('/games');
    cy.get(`[data-testid=GLE_ENTRY_${gameId}]`).should('contain.text', '1 : 2');
    cy.get(`[data-testid=GLE_ENTRY_${gameId}]`).should('contain.text', 'finished');
    cy.visit('/');
    cy.get(`app-game-detail-header`).should('not.exist');
    cy.get(`[data-testid=GLE_ENTRY_${gameId}]`).should('not.exist');
  });
}

function addAndValidateKickoffEvent() {
  cy.get('[data-testid=GDP_ADD_EVENT_BTN]').click();
  cy.get('[data-testid=AGEF_SUBMIT_BUTTON]').click();
  cy.get('mat-error').should('have.length', 1);
  // add events
  cy.get('[data-testid=AGEF_TYPE_SELECT]').click();
  cy.get('[data-testid=AGEF_TYPE_KICKOFF]').click();
  cy.get('[data-testid=AGEF_SUBMIT_BUTTON]').click();

  cy.get('app-game-detail-timeline').should('contain.text', 'Kick-off');
  cy.get('app-game-detail-timeline').should('contain.text', "0'");
  cy.get('app-game-detail-timeline').should('contain.text', 'sports');

  cy.get('[data-testid=GDH_LIVE_INDICATOR]').should('be.visible');
  cy.get('[data-testid=GDH_STATUS]').should('contain.text', 'live');

  cy.visit('/games');
  cy.get(`@${gameResourceIdAlias}`).then((gameId) => {
    cy.get(`[data-testid=GLE_ENTRY_${gameId}]`).should('contain.text', 'live');
    cy.get(`[data-testid=GLE_${gameId}_LIVE_INDICATOR]`).should('be.visible');
    cy.go('back');
  });
}

function addGoalEvents() {
  const goalEvents: GameEvent[] = [
    {
      eventType: 'GOAL',
      minute: 91,
      minuteExtra: 0,
      eventName: 'GOAL',
      primaryPlayer: teamLannister.players[0],
      side: 'AWAY',
    },
    {
      eventType: 'GOAL',
      minute: 95,
      minuteExtra: 0,
      eventName: 'GOAL',
      primaryPlayer: teamLannister.players[0],
      side: 'AWAY',
    },
    {
      eventType: 'GOAL',
      minute: 95,
      minuteExtra: 0,
      eventName: 'GOAL',
      primaryPlayer: teamStark.players[1],
      secondaryPlayer: teamStark.players[3],
      side: 'HOME',
    },
  ];

  for (const goalEvent of goalEvents) {
    cy.get('[data-testid=GDP_ADD_EVENT_BTN]').click();
    cy.get('[data-testid=AGEF_TYPE_SELECT]').click();
    cy.get(`[data-testid=AGEF_TYPE_${goalEvent.eventType}]`).click();
    cy.get('[data-testid=AGEF_MINUTE_INPUT]').type(goalEvent.minute.toString());
    cy.get('[data-testid=AGEF_MINUTE_EXTRA_INPUT]').type(goalEvent.minuteExtra.toString());

    cy.get('[data-testid=AGEF_SIDE_SELECT]').click({ force: true });
    cy.get(`[data-testid=AGEF_SIDE_OPTION_${goalEvent.side}]`).click();
    cy.get('[data-testid=AGEF_PRIMARY_PLAYER_SELECT]').click({ force: true });
    cy.get(`[data-testid=AGEF_PRIMARY_PLAYER_OPTION_${goalEvent.primaryPlayer?._id}]`).click();

    if (goalEvent.secondaryPlayer) {
      cy.get('[data-testid=AGEF_SECONDARY_PLAYER_SELECT]').click({ force: true });
      cy.get(
        `[data-testid=AGEF_SECONDARY_PLAYER_OPTION_${goalEvent.secondaryPlayer?._id}]`,
      ).click();
    }

    cy.get('[data-testid=AGEF_SUBMIT_BUTTON]').click();
  }
  cy.get('app-game-detail-header').should('contain.text', '1:2');

  cy.visit('/home');
  cy.get('app-game-detail-header').should('contain.text', '1:2');
  cy.get('app-game-detail-header').should('contain.text', teamStark.name);
  cy.get('app-game-detail-header').should('contain.text', teamLannister.name);
  cy.get('app-game-detail-header').should('contain.html', teamLannister.logoUrl);
  cy.get('app-game-detail-header').should('contain.html', teamStark.logoUrl);
  cy.go('back');
}

function addStandardEvents() {
  const standardEvents: GameEvent[] = [
    {
      eventType: 'PERIOD_START',
      eventName: 'Period start',
      minute: 0,
      minuteExtra: 0,
    },
    {
      eventType: 'PERIOD_END',
      eventName: 'Period end',
      minute: 45,
      minuteExtra: 3,
    },
    {
      eventType: 'HALF_TIME',
      eventName: 'Half-time',
      minute: 45,
      minuteExtra: 3,
    },
    {
      eventType: 'OVERTIME_START',
      eventName: 'Overtime start',
      minute: 90,
      minuteExtra: 0,
    },
  ];

  for (const event of standardEvents) {
    cy.get('[data-testid=GDP_ADD_EVENT_BTN]').click();
    cy.get('[data-testid=AGEF_TYPE_SELECT]').click();
    cy.get(`[data-testid=AGEF_TYPE_${event.eventType}]`).click();
    cy.get('[data-testid=AGEF_MINUTE_INPUT]').type(event.minute.toString());
    cy.get('[data-testid=AGEF_MINUTE_EXTRA_INPUT]').type(event.minuteExtra.toString());
    cy.get('[data-testid=AGEF_SUBMIT_BUTTON]').click();

    cy.get('app-game-detail-timeline').should('contain.text', event.eventName);
    if (event.minuteExtra == 0) {
      cy.get('app-game-detail-timeline').should('contain.text', `${event.minute}'`);
    } else {
      cy.get('app-game-detail-timeline').should(
        'contain.text',
        `${event.minute}+${event.minuteExtra}`,
      );
    }
  }
}

function createGame(home: Team, away: Team) {
  cy.intercept('POST', '/api/games').as('createGame');

  cy.get('[data-testid="GO_ADD_BTN"]').click();
  cy.get('[data-testid="AGF_SUBMIT_BTN"]').click();
  cy.get('mat-error').should('have.length', 3);

  cy.get('[data-testid="ADD_GAME_SELECT_HOME_TEAM"]').click({ force: true });
  cy.get(`[data-testid="ADD_GAME_OPTION_HOME_${home._id}"]`).click();

  cy.get('[data-testid="ADD_GAME_SELECT_AWAY_TEAM"]').click({ force: true });
  cy.get(`[data-testid="ADD_GAME_OPTION_AWAY_${away._id}"]`).click();

  cy.get('[data-testid=AGF_STARTTIME_INPUT').type('9/15/2026', { force: true });

  cy.get('mat-error').should('have.length', 2);

  home.players
    .filter((p) => p.inLineup)
    .forEach((p) => {
      cy.get(`[data-testid=AGF_LINEUP_HOME_${p._id}]`).click();
    });

  away.players
    .filter((p) => p.inLineup)
    .forEach((p) => {
      cy.get(`[data-testid=AGF_LINEUP_AWAY_${p._id}]`).click();
    });

  cy.get('[data-testid="AGF_SUBMIT_BTN"]').click();

  cy.wait('@createGame').its('response.body._id').as(gameResourceIdAlias);

  cy.get(`@${gameResourceIdAlias}`).then((gameId) => {
    cy.get(`[data-testid=GLE_ENTRY_${gameId}]`).should('contain.text', 'upcoming');
    cy.get(`[data-testid=GLE_ENTRY_${gameId}]`).should('contain.text', 'Sep 15, 2026');
    cy.get(`[data-testid=GLE_ENTRY_${gameId}]`).should('contain.text', teamStark.name);
    cy.get(`[data-testid=GLE_ENTRY_${gameId}]`).should('contain.html', teamStark.logoUrl);
    cy.get(`[data-testid=GLE_ENTRY_${gameId}]`).should('contain.html', teamLannister.logoUrl);

    cy.visit('/home');
    cy.get(`[data-testid=GLE_ENTRY_${gameId}]`).should('contain.text', 'upcoming');
    cy.get(`[data-testid=GLE_ENTRY_${gameId}]`).should('contain.text', 'Sep 15, 2026');
    cy.get(`[data-testid=GLE_ENTRY_${gameId}]`).should('contain.text', teamStark.name);
    cy.get(`[data-testid=GLE_ENTRY_${gameId}]`).should('contain.html', teamStark.logoUrl);
    cy.get(`[data-testid=GLE_ENTRY_${gameId}]`).should('contain.html', teamLannister.logoUrl);
    cy.visit('/games');
  });
}

function validateLineups() {
  [teamStark, teamLannister].forEach((t) => {
    cy.get(`[data-testid=GDL_LINEUP_${t._id}]`).should('contain.text', t.name);
    cy.get(`[data-testid=GDL_LINEUP_${t._id}]`).should('contain.html', t.logoUrl);

    t.players
      .filter((p) => p.inLineup)
      .forEach((p) => {
        cy.get(`[data-testid=GDL_LINEUP_${t._id}]`).should(
          'contain.text',
          `${p.firstname} ${p.lastname}`,
        );
      });
  });
}

const teamStark: Team = {
  name: 'Team Stark',
  logoUrl: 'https://images.seeklogo.com/logo-png/19/1/house-stark-logo-png_seeklogo-195050.png',
  players: [
    {
      firstname: 'Jon',
      lastname: 'Snow',
      inLineup: true,
    },
    {
      firstname: 'Rob',
      lastname: 'Stark',
      inLineup: true,
    },
    {
      firstname: 'Bran',
      lastname: 'Stark',
    },
    {
      firstname: 'Rickon',
      lastname: 'Stark',
      inLineup: true,
    },
  ],
};

const teamLannister: Team = {
  name: 'Team Lannister',
  logoUrl: 'https://images.seeklogo.com/logo-png/25/2/house-lannister-logo-png_seeklogo-254146.png',
  players: [
    {
      firstname: 'Jamie',
      lastname: 'Lannister',
      inLineup: true,
    },
    {
      firstname: 'Tyrion',
      lastname: 'Lannister',
    },
    {
      firstname: 'Cersei',
      lastname: 'Lannister',
      inLineup: true,
    },
    {
      firstname: 'Tywin',
      lastname: 'Lannister',
      inLineup: true,
    },
  ],
};

interface Team {
  _id?: string;
  name: string;
  logoUrl: string;
  players: Player[];
}

interface Player {
  _id?: string;
  firstname: string;
  lastname: string;
  inLineup?: boolean;
}

interface GameEvent {
  eventType: string;
  eventName: string;
  minute: number;
  minuteExtra: number;
  side?: string;
  primaryPlayer?: Player;
  secondaryPlayer?: Player;
}
