import { describe, it, expect, beforeEach, vi } from "vitest";
import { Test, TestingModule } from "@nestjs/testing";
import { TeamController } from "./team.controller.js";
import { TeamService } from "../services/team.service.js";
import { Team } from "../schema/team.schema.js";
import { getModelToken } from "@nestjs/mongoose";
import { AuthGuard } from "../../authentication/auth.guard.js";
import { JwtService } from "@nestjs/jwt";

describe("TeamController", () => {
  let controller: TeamController;
  const mockSave = vi.fn().mockResolvedValue({ _id: "1", name: "Test Team" });

  class MockTeamModel {
    constructor(data: any) {
      Object.assign(this, data);
    }
    save = mockSave;
    static find = vi.fn();
    static findById = vi.fn();
    static findOne = vi.fn();
    static create = vi.fn();
  }

  beforeEach(async () => {
    const authGuardMock = {
      canActivate: vi.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamController],
      providers: [
        TeamService,
        { provide: AuthGuard, useValue: authGuardMock },
        {
          provide: JwtService,
          useValue: {},
        },
        { provide: getModelToken(Team.name), useValue: MockTeamModel },
      ],
    }).compile();

    controller = module.get<TeamController>(TeamController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
