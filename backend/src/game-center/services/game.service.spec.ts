import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { GameService } from "./game.service.js";
import {
  Game,
  GameEventSchema,
  GameEventType,
  GameSide,
} from "../schema/game.schema.js";
import { TeamService } from "./team.service.js";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Types } from "mongoose";

describe("GameService", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should be defined", async () => {
    const { service } = await setup();
    expect(service).toBeDefined();
  });

  describe("findAll", () => {
    it("should return all games as sorted list", async () => {
      const { service, gameModel } = await setup();
      const games = structuredClone(props.games);

      gameModel.find.mockReturnValue(games);

      const result = await service.findAll();

      expect(gameModel.find).toHaveBeenCalled();
      expect(result[0]._id).toEqual("game-id-2");
      expect(result[1]._id).toEqual("game-id-1");
    });
  });

  describe("findById", () => {
    it("should return the game found by its Id", async () => {
      const { service, gameModel } = await setup();
      gameModel.findById.mockReturnValue(props.games[0]);

      const result = await service.findById("game-id-1");

      expect(gameModel.findById).toHaveBeenCalledExactlyOnceWith("game-id-1");
      expect(result).toEqual(props.games[0]);
    });

    it("should return the game found by its Id with sorted Events", async () => {
      const { service, gameModel } = await setup();
      gameModel.findById.mockReturnValue(props.games[0]);

      const result = await service.findById("game-id-1");
      const events = result?.events as any;

      expect(gameModel.findById).toHaveBeenCalledExactlyOnceWith("game-id-1");
      expect(events[0]._id).toBe("event3");
      expect(events[1]._id).toBe("event2");
      expect(events[2]._id).toBe("event4");
      expect(events[3]._id).toBe("event1");
    });
  });

  describe("createGame", () => {
    it("should create and save a new game with valid teams and lineups", async () => {
      const { service, mockTeamService } = await setup();
      mockTeamService.findById
        .mockResolvedValueOnce(props.homeTeam)
        .mockResolvedValueOnce(props.awayTeam);

      const dto = buildDto();
      const result = await service.createGame(dto as any);

      expect(mockTeamService.findById).toHaveBeenCalledWith("team-home-id");
      expect(mockTeamService.findById).toHaveBeenCalledWith("team-away-id");
      expect(result).toMatchObject({
        startDate: dto.startDate,
        homeTeam: expect.objectContaining({ name: props.homeTeam.name }),
        awayTeam: expect.objectContaining({ name: props.awayTeam.name }),
      });
    });

    it("should throw NotFoundException when home team is not found", async () => {
      const { service, mockTeamService } = await setup();
      mockTeamService.findById.mockResolvedValueOnce(null);

      await expect(service.createGame(buildDto() as any)).rejects.toThrow(
        NotFoundException,
      );
    });

    it("should throw NotFoundException when away team is not found", async () => {
      const { service, mockTeamService } = await setup();
      mockTeamService.findById
        .mockResolvedValueOnce(props.homeTeam)
        .mockResolvedValueOnce(null);

      await expect(service.createGame(buildDto() as any)).rejects.toThrow(
        NotFoundException,
      );
    });

    it("should throw BadRequestException when home and away team are the same", async () => {
      const { service, mockTeamService } = await setup();
      mockTeamService.findById.mockResolvedValue(props.homeTeam);

      const dto = buildDto({
        homeTeamId: "team-home-id",
        awayTeamId: "team-home-id",
      });

      await expect(service.createGame(dto as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it("should throw NotFoundException when lineup contains an invalid player id", async () => {
      const { service, mockTeamService } = await setup();
      mockTeamService.findById
        .mockResolvedValueOnce(props.homeTeam)
        .mockResolvedValueOnce(props.awayTeam);

      const dto = buildDto({ lineupHomeTeam: ["not-a-real-player"] });

      await expect(service.createGame(dto as any)).rejects.toThrow(
        NotFoundException,
      );
    });

    it("should throw BadRequestException when a lineup is empty", async () => {
      const { service, mockTeamService } = await setup();
      mockTeamService.findById
        .mockResolvedValueOnce(props.homeTeam)
        .mockResolvedValueOnce(props.awayTeam);

      const dto = buildDto({ lineupHomeTeam: [] });

      await expect(service.createGame(dto as any)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe("addEvent", () => {
    it("should add a valid GOAL event and return it", async () => {
      const { service, gameModel } = await setup();
      const game = buildGame();
      gameModel.findById.mockReturnValue({
        lean: vi.fn().mockResolvedValue(game),
      });
      gameModel.findByIdAndUpdate.mockResolvedValue(game);

      const eventDto = {
        minute: 10,
        type: GameEventType.GOAL,
        team: GameSide.HOME,
        primaryPlayerId: props.homeTeam.players[0].id,
      };

      const result = await service.addEvent(eventDto as any, "game-id-1");

      expect(gameModel.findById).toHaveBeenCalledWith("game-id-1");
      expect(gameModel.findByIdAndUpdate).toHaveBeenCalled();
      expect(result.type).toBe(GameEventType.GOAL);
      expect(result.primaryPlayerId?.toString()).toBe(
        props.homeTeam.players[0].id,
      );
    });

    it("should throw NotFoundException when the game does not exist", async () => {
      const { service, gameModel } = await setup();
      gameModel.findById.mockReturnValue({
        lean: vi.fn().mockResolvedValue(null),
      });

      const eventDto = {
        minute: 10,
        type: GameEventType.GOAL,
        team: GameSide.HOME,
        primaryPlayerId: props.homeTeam.players[0].id,
      };

      await expect(
        service.addEvent(eventDto as any, "nonexistent-id"),
      ).rejects.toThrow(NotFoundException);
    });

    it("should throw BadRequestException when a GOAL event has no primaryPlayerId", async () => {
      const { service, gameModel } = await setup();
      gameModel.findById.mockReturnValue({
        lean: vi.fn().mockResolvedValue(buildGame()),
      });

      const eventDto = {
        minute: 10,
        type: GameEventType.GOAL,
        team: GameSide.HOME,
      };

      await expect(
        service.addEvent(eventDto as any, "game-id-1"),
      ).rejects.toThrow(BadRequestException);
    });

    it("should throw BadRequestException when primaryPlayerId equals secondaryPlayerId", async () => {
      const { service, gameModel } = await setup();
      gameModel.findById.mockReturnValue({
        lean: vi.fn().mockResolvedValue(buildGame()),
      });

      const samePlayerId = props.homeTeam.players[0].id;
      const eventDto = {
        minute: 10,
        type: GameEventType.GOAL,
        team: GameSide.HOME,
        primaryPlayerId: samePlayerId,
        secondaryPlayerId: samePlayerId,
      };

      await expect(
        service.addEvent(eventDto as any, "game-id-1"),
      ).rejects.toThrow(BadRequestException);
    });

    it("should throw BadRequestException when the player is not part of the team's lineup", async () => {
      const { service, gameModel } = await setup();
      gameModel.findById.mockReturnValue({
        lean: vi.fn().mockResolvedValue(buildGame()),
      });

      const eventDto = {
        minute: 10,
        type: GameEventType.GOAL,
        team: GameSide.HOME,
        primaryPlayerId: new Types.ObjectId().toString(), // valid ObjectId, not in lineup
      };

      await expect(
        service.addEvent(eventDto as any, "game-id-1"),
      ).rejects.toThrow(BadRequestException);
    });
  });
});

const props = {
  mockGameDocument: {
    _id: "game-id-123",
    name: "",
  },
  games: [
    {
      _id: "game-id-1",
      startDate: new Date(2018, 1, 1),
      events: [
        {
          _id: "event1",
          minute: 0,
          type: GameEventType.KICKOFF,
          timeStamp: "2026-09-11T09:58:29.583Z",
        },
        {
          _id: "event2",
          minute: 2,
          type: GameEventType.GOAL,
        },
        {
          _id: "event3",
          minute: 2,
          minuteExtra: 2,
          type: GameEventType.GOAL,
        },
        {
          _id: "event4",
          minute: 0,
          type: GameEventType.PERIOD_START,
          timeStamp: "2026-09-11T09:58:55.644Z",
        },
      ],
    },
    {
      _id: "game-id-2",
      startDate: new Date(2019, 1, 1),
      events: [],
    },
  ],
  homeTeam: {
    id: "HomeTeamId",
    name: "Home Team",
    logoUrl: "HomeTeam.png",
    players: [
      {
        id: "6aa3d0df79a3bcb2713f80d3",
        _id: new Types.ObjectId("6aa3d0df79a3bcb2713f80d3"),
        name: "Donald",
        lastname: "Duck",
      },
      {
        id: "6aa3cd2e33d44b678b7357df",
        _id: new Types.ObjectId("6aa3cd2e33d44b678b7357df"),
        name: "Dagobert",
        lastname: "Duck",
      },
    ],
  },
  awayTeam: {
    id: "AwayTeamId",
    name: "Away Team",
    logoUrl: "AwayTeam.png",
    players: [
      {
        id: "6aa0f7d201ccd89aab88fe9f",
        _id: new Types.ObjectId("6aa0f7d201ccd89aab88fe9f"),
        name: "Gustav",
        lastname: "Gans",
      },
      {
        id: "6aa008bb5ce79de37b708bba",
        _id: new Types.ObjectId("6aa008bb5ce79de37b708bba"),
        name: "Klaas",
        lastname: "Klever",
      },
    ],
  },
};

function buildDto(overrides = {}) {
  return {
    homeTeamId: "team-home-id",
    awayTeamId: "team-away-id",
    lineupHomeTeam: [props.homeTeam.players[0].id],
    lineupAwayTeam: [props.awayTeam.players[0].id],
    startDate: new Date(2024, 0, 1),
    ...overrides,
  };
}

function buildGame() {
  return {
    _id: "game-id-1",
    homeTeam: { players: [props.homeTeam.players[0]] },
    awayTeam: { players: [props.awayTeam.players[0]] },
  };
}

async function setup() {
  // Mock model as a constructor function with static methods attached.
  const MockGameModel: any = vi.fn().mockImplementation(function (
    this: any,
    data: any,
  ) {
    Object.assign(this, data);
    this.save = vi
      .fn()
      .mockResolvedValue({ ...props.mockGameDocument, ...data });
  });
  MockGameModel.find = vi.fn();
  MockGameModel.findById = vi.fn();
  MockGameModel.findByIdAndUpdate = vi.fn();
  MockGameModel.deleteOne = vi.fn();

  const mockTeamService = {
    findById: vi.fn(),
  };

  const module: TestingModule = await Test.createTestingModule({
    providers: [
      GameService,
      {
        provide: getModelToken(Game.name),
        useValue: MockGameModel,
      },
      { provide: TeamService, useValue: mockTeamService },
    ],
  }).compile();

  const service = module.get<GameService>(GameService);
  const gameModel = module.get(getModelToken(Game.name));

  return {
    service,
    gameModel,
    mockTeamService,
  };
}
