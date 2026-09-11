import { INestApplication } from "@nestjs/common";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../../app.module.js";
import { MongooseModule } from "@nestjs/mongoose";
import mongoConfig from "../../config/mongo.config.js";
import { AuthGuard } from "../../authentication/auth.guard.js";
import request from "supertest";

describe("TeamController", () => {
  let app: INestApplication;
  let appWithoutAuth: INestApplication;
  let mongo: MongoMemoryServer;

  let teamA: any;
  let teamB: any;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();

    const moduleWithAuThFixture: TestingModule = await Test.createTestingModule(
      {
        imports: [AppModule, MongooseModule.forRoot(mongo.getUri())],
      },
    )
      .overrideProvider(mongoConfig.KEY)
      .useValue({
        uri: mongo.getUri(),
        user: undefined,
        pass: undefined,
      })
      .compile();

    const moduleWithoutAuThFixture: TestingModule =
      await Test.createTestingModule({
        imports: [AppModule, MongooseModule.forRoot(mongo.getUri())],
      })
        .overrideProvider(mongoConfig.KEY)
        .useValue({
          uri: mongo.getUri(),
          user: undefined,
          pass: undefined,
        })
        .overrideGuard(AuthGuard)
        .useValue({ canActivate: () => true })
        .compile();

    app = moduleWithAuThFixture.createNestApplication();
    appWithoutAuth = moduleWithoutAuThFixture.createNestApplication();

    await app.init();
    await appWithoutAuth.init();
  });

  beforeAll(async () => {
    const teamARes = await request(appWithoutAuth.getHttpServer())
      .post("/teams")
      .send(teamADto)
      .expect(201);
    teamA = teamARes.body;
    const teamBRes = await request(appWithoutAuth.getHttpServer())
      .post("/teams")
      .send(teamBDto)
      .expect(201);
    teamB = teamBRes.body;
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }

    if (appWithoutAuth) {
      await appWithoutAuth.close();
    }

    if (mongo) {
      await mongo.stop();
    }
  });

  describe("GET /games", () => {
    it("shoudl return empty list when no games available", async () => {
      const response = await request(app.getHttpServer())
        .get("/games")
        .expect(200);
      expect(response.body).toMatchObject([]);
    });
  });

  describe("POST /games", () => {
    it("should return 401 if not authenticated", async () => {
      await request(app.getHttpServer()).post("/games").expect(401);
    });

    it("should create a new game", async () => {
      const response = await request(appWithoutAuth.getHttpServer())
        .post("/games")
        .send({
          homeTeamId: teamA._id,
          awayTeamId: teamB._id,
          startDate: new Date(),
          lineupHomeTeam: [teamA.players[0]._id, teamA.players[1]._id],
          lineupAwayTeam: [teamB.players[0]._id, teamB.players[1]._id],
        })
        .expect(201);

      expect(response.body).toMatchObject({
        awayTeam: {
          logoUrl: "teamB.png",
          name: "Team B",
          players: [
            {
              firstname: "Klaas",
              lastname: "Klever",
            },
            {
              firstname: "Mac",
              lastname: "Moneysac",
            },
          ],
          team: teamB._id,
        },
        events: [],
        homeTeam: {
          logoUrl: "teamA.png",
          name: "Team A",
          players: [
            {
              firstname: "Donald",
              lastname: "Duck",
            },
            {
              firstname: "Dagobert",
              lastname: "Duck",
            },
          ],
          team: teamA._id,
        },
      });
    });
  });

  describe("GET /game/:gameId", () => {
    it("should return a game", async () => {
      const createResponse = await request(appWithoutAuth.getHttpServer())
        .post("/games")
        .send({
          homeTeamId: teamA._id,
          awayTeamId: teamB._id,
          startDate: new Date(),
          lineupHomeTeam: [teamA.players[0]._id, teamA.players[1]._id],
          lineupAwayTeam: [teamB.players[0]._id, teamB.players[1]._id],
        })
        .expect(201);

      const gameId = createResponse.body._id;
      const response = await request(app.getHttpServer())
        .get(`/games/${gameId}`)
        .expect(200);
      expect(response.body).toMatchObject({
        _id: gameId,
      });
    });

    it("should return 404 when game not exits", async () => {
      await request(app.getHttpServer())
        .get(`/games/507f1f77bcf86cd799439011`)
        .expect(404);
    });
  });

  describe("POST /games/:gameId/events", () => {
    it("should return 401 if not authenticated", async () => {
      const createGameResponse = await request(appWithoutAuth.getHttpServer())
        .post("/games")
        .send({
          homeTeamId: teamA._id,
          awayTeamId: teamB._id,
          startDate: new Date(),
          lineupHomeTeam: [teamA.players[0]._id, teamA.players[1]._id],
          lineupAwayTeam: [teamB.players[0]._id, teamB.players[1]._id],
        })
        .expect(201);
      const gameId = createGameResponse.body._id;
      await request(app.getHttpServer())
        .post(`/games/${gameId}/events`)
        .expect(401);
    });

    it("should add an event", async () => {
      const createGameResponse = await request(appWithoutAuth.getHttpServer())
        .post("/games")
        .send({
          homeTeamId: teamA._id,
          awayTeamId: teamB._id,
          startDate: new Date(),
          lineupHomeTeam: [teamA.players[0]._id, teamA.players[1]._id],
          lineupAwayTeam: [teamB.players[0]._id, teamB.players[1]._id],
        })
        .expect(201);

      const gameId = createGameResponse.body._id;
      await request(appWithoutAuth.getHttpServer())
        .post(`/games/${gameId}/events`)
        .send({
          minute: 45,
          minuteExtra: 2,
          type: "GOAL",
          team: "HOME",
          primaryPlayerId: createGameResponse.body.homeTeam.players[0]._id,
          secondaryPlayerId: createGameResponse.body.homeTeam.players[1]._id,
        })
        .expect(201);

      const getGameResponse = await request(appWithoutAuth.getHttpServer())
        .get(`/games/${gameId}`)
        .expect(200);
      expect(getGameResponse.body).toMatchObject({
        events: [
          {
            minute: 45,
            minuteExtra: 2,
            primaryPlayerId: createGameResponse.body.homeTeam.players[0]._id,
            secondaryPlayerId: createGameResponse.body.homeTeam.players[1]._id,
            team: "HOME",
            type: "GOAL",
          },
        ],
      });
    });
  });
});

const teamADto = {
  name: "Team A",
  logoUrl: "teamA.png",
  players: [
    {
      firstname: "Donald",
      lastname: "Duck",
    },
    {
      firstname: "Dagobert",
      lastname: "Duck",
    },
    {
      firstname: "Daisy",
      lastname: "Duck",
    },
  ],
};

const teamBDto = {
  name: "Team B",
  logoUrl: "teamB.png",
  players: [
    {
      firstname: "Klaas",
      lastname: "Klever",
    },
    {
      firstname: "Mac",
      lastname: "Moneysac",
    },
    {
      firstname: "Gustav",
      lastname: "Gans",
    },
  ],
};
