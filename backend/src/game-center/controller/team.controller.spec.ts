import { MongooseModule } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import { AppModule } from "../../app.module.js";
import { AuthGuard } from "../../authentication/auth.guard.js";
import mongoConfig from "../../config/mongo.config.js";

describe("TeamController", () => {
  let app: INestApplication;
  let appWithoutAuth: INestApplication;
  let mongo: MongoMemoryServer;

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

  afterAll(async () => {
    await app.close();
    await appWithoutAuth.close();
    await mongo.stop();
  });

  describe("GET /teams", () => {
    it("should return 401 when not authenticated", async () => {
      await request(app.getHttpServer()).get("/teams").expect(401);
    });

    it("should return an empty array when there are no teams", async () => {
      const response = await request(appWithoutAuth.getHttpServer())
        .get("/teams")
        .expect(200);
      expect(response.body).toEqual([]);
    });
  });

  describe("POST /teams", () => {
    it("should return 401 when not authenticated", async () => {
      await request(app.getHttpServer()).post("/teams").expect(401);
    });

    it("should create a team", async () => {
      const team = {
        name: "My Team",
        logoUrl: "LogoUrl.png",
      };
      const response = await request(appWithoutAuth.getHttpServer())
        .post("/teams")
        .send(team)
        .expect(201);
      expect(response.body).toMatchObject(team);
      expect(response.body._id).toBeDefined();
    });
  });

  describe("GET /teams/:teamId", () => {
    it("should return 401 when not authenticated", async () => {
      await request(app.getHttpServer()).get("/teams/someid").expect(401);
    });

    it("should return a team", async () => {
      const createResponse = await request(appWithoutAuth.getHttpServer())
        .post("/teams")
        .send({ name: "My Team Second", logoUrl: "LogoUrl.png" })
        .expect(201);

      const teamId = createResponse.body._id;

      const response = await request(appWithoutAuth.getHttpServer())
        .get(`/teams/${teamId}`)
        .expect(200);

      expect(response.body).toMatchObject({
        _id: teamId,
        name: "My Team Second",
      });
    });

    it("should return 404 when the team does not exist", async () => {
      const teamId = "507f1f77bcf86cd799439011";

      const response = await request(appWithoutAuth.getHttpServer())
        .get(`/teams/${teamId}`)
        .expect(404);

      expect(response.body.message).toBe(`Team with ID ${teamId} not found`);
    });

    it("should return 400 for an invalid ObjectId", async () => {
      await request(appWithoutAuth.getHttpServer())
        .get("/teams/not-an-object-id")
        .expect(400);
    });
  });

  describe("PUT /teams/:teamId", () => {
    it("should return 401 when not authenticated", async () => {
      await request(app.getHttpServer()).put("/teams/someid").expect(401);
    });

    it("should update a team", async () => {
      const createResponse = await request(appWithoutAuth.getHttpServer())
        .post("/teams")
        .send({ name: "Team to Update", logoUrl: "logoUrl.png" })
        .expect(201);

      const teamId = createResponse.body._id;
      await request(appWithoutAuth.getHttpServer())
        .put(`/teams/${teamId}`)
        .send({
          name: "Updated Team",
          logoUrl: "updatedLogoUrl.png",
          players: [{ firstname: "Donald", lastname: "Duck" }],
        })
        .expect(200);

      const updatedResult = await request(appWithoutAuth.getHttpServer())
        .get(`/teams/${teamId}`)
        .expect(200);

      expect(updatedResult.body).toMatchObject({
        name: "Updated Team",
        logoUrl: "updatedLogoUrl.png",
        players: [{ firstname: "Donald", lastname: "Duck" }],
      });
    });
  });

  describe("Delete /teams/:teamId", () => {
    it("should return 401 when not authenticated", async () => {
      await request(app.getHttpServer()).delete("/teams/someid").expect(401);
    });

    it("should delete a team", async () => {
      const createResponse = await request(appWithoutAuth.getHttpServer())
        .post("/teams")
        .send({ name: "Team to Delete", logoUrl: "logoUrl.png" })
        .expect(201);

      const teamId = createResponse.body._id;
      await request(appWithoutAuth.getHttpServer())
        .delete(`/teams/${teamId}`)
        .expect(200);
      await request(appWithoutAuth.getHttpServer())
        .get(`/teams/${teamId}`)
        .expect(404);
    });
  });
});
