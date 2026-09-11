import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { MongoServerError } from "mongodb";
import { Team } from "../schema/team.schema.js";
import { TeamDto } from "../dto/team.dto.js";
import { TeamService } from "./team.service.js";

describe("TeamService", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should be defined", async () => {
    const { service } = await setup();
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create and save a new team", async () => {
      const { service } = await setup();
      const result = await service.create(props.teamDto);

      expect(result).toEqual({ ...props.mockTeamDocument, ...props.teamDto });
    });

    it("should throw BadRequestException on duplicate key error (code 11000)", async () => {
      const { service, teamModel } = await setup();
      const duplicateError = new MongoServerError({ message: "duplicate key" });
      duplicateError.code = 11000;

      teamModel.mockImplementation(function (this: any) {
        this.save = vi.fn().mockRejectedValue(duplicateError);
      });

      await expect(service.create(props.teamDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it("should rethrow non-duplicate errors", async () => {
      const { service, teamModel } = await setup();

      teamModel.mockImplementation(() => ({
        save: vi.fn().mockRejectedValue(new Error("connection lost")),
      }));

      await expect(service.create(props.teamDto)).rejects.toThrow(
        "connection lost",
      );
    });
  });

  describe("findAll", () => {
    it("should return all teams", async () => {
      const { service, teamModel } = await setup();
      const teams = [props.mockTeamDocument];

      teamModel.find.mockReturnValue({
        exec: vi.fn().mockResolvedValue(teams),
      });

      const result = await service.findAll();

      expect(teamModel.find).toHaveBeenCalled();
      expect(result).toEqual(teams);
    });
  });

  describe("findById", () => {
    it("should return a team when found", async () => {
      const { service, teamModel } = await setup();
      teamModel.findById.mockResolvedValue(props.mockTeamDocument);

      const result = await service.findById("team-id-123");

      expect(teamModel.findById).toHaveBeenCalledWith("team-id-123");
      expect(result).toEqual(props.mockTeamDocument);
    });

    it("should return null when not found", async () => {
      const { service, teamModel } = await setup();
      teamModel.findById.mockResolvedValue(null);

      const result = await service.findById("nonexistent-id");

      expect(result).toBeNull();
    });
  });

  describe("updateTeam", () => {
    it("should update and return the team", async () => {
      const { service, teamModel } = await setup();
      const updatedTeam = { ...props.mockTeamDocument, name: "Team B" };

      teamModel.findByIdAndUpdate.mockReturnValue({
        lean: vi.fn().mockResolvedValue(updatedTeam),
      });

      const result = await service.updateTeam("team-id-123", {
        name: "Team B",
      } as TeamDto);

      expect(teamModel.findByIdAndUpdate).toHaveBeenCalledWith(
        "team-id-123",
        { $set: { name: "Team B" } },
        { returnDocument: "after", runValidators: true },
      );
      expect(result).toEqual(updatedTeam);
    });

    it("should throw NotFoundException when team does not exist", async () => {
      const { service, teamModel } = await setup();
      teamModel.findByIdAndUpdate.mockReturnValue({
        lean: vi.fn().mockResolvedValue(null),
      });

      await expect(
        service.updateTeam("nonexistent-id", props.teamDto),
      ).rejects.toThrow(NotFoundException);
    });

    it("should throw BadRequestException on duplicate key error (code 11000)", async () => {
      const { service, teamModel } = await setup();
      const duplicateError = new MongoServerError({ message: "duplicate key" });
      duplicateError.code = 11000;

      teamModel.findByIdAndUpdate.mockReturnValue({
        lean: vi.fn().mockRejectedValue(duplicateError),
      });

      await expect(
        service.updateTeam("team-id-123", props.teamDto),
      ).rejects.toThrow(BadRequestException);
    });

    it("should rethrow non-duplicate errors", async () => {
      const { service, teamModel } = await setup();
      teamModel.findByIdAndUpdate.mockReturnValue({
        lean: vi.fn().mockRejectedValue(new Error("connection lost")),
      });

      await expect(
        service.updateTeam("team-id-123", props.teamDto),
      ).rejects.toThrow("connection lost");
    });
  });

  describe("delete", () => {
    it("should delete a team by id", async () => {
      const { service, teamModel } = await setup();
      const deleteResult = { acknowledged: true, deletedCount: 1 };

      teamModel.deleteOne.mockResolvedValue(deleteResult);

      const result = await service.delete("team-id-123");

      expect(teamModel.deleteOne).toHaveBeenCalledWith({ _id: "team-id-123" });
      expect(result).toEqual(deleteResult);
    });
  });
});

const props = {
  mockTeamDocument: {
    _id: "team-id-123",
    name: "",
  },
  teamDto: {
    name: "Team A",
  } as TeamDto,
};

async function setup() {
  // Mock model as a constructor function with static methods attached.
  const MockTeamModel: any = vi.fn().mockImplementation(function (
    this: any,
    data: any,
  ) {
    Object.assign(this, data);
    this.save = vi
      .fn()
      .mockResolvedValue({ ...props.mockTeamDocument, ...data });
  });
  MockTeamModel.find = vi.fn();
  MockTeamModel.findById = vi.fn();
  MockTeamModel.findByIdAndUpdate = vi.fn();
  MockTeamModel.deleteOne = vi.fn();

  const module: TestingModule = await Test.createTestingModule({
    providers: [
      TeamService,
      {
        provide: getModelToken(Team.name),
        useValue: MockTeamModel,
      },
    ],
  }).compile();

  const service = module.get<TeamService>(TeamService);
  const teamModel = module.get(getModelToken(Team.name));

  return {
    service,
    teamModel,
  };
}
