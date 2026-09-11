import { Test, TestingModule } from "@nestjs/testing";
import { AuthenticationService } from "./authentication.service.js";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "./auth.guard.js";
import { ExecutionContext, UnauthorizedException } from "@nestjs/common";

describe("AuthGuard", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should be defined", async () => {
    const { guard } = await setup();
    expect(guard).toBeDefined();
  });

  describe("canActivate", () => {
    it("should return true and attach the decoded user when the token is valid", async () => {
      const { guard, jwtService } = await setup();

      const decodedPayload = { sub: "user-id-123", username: "johndoe" };

      vi.spyOn(jwtService, "verifyAsync").mockResolvedValue(decodedPayload);

      const context = createDefaultContext({
        authorization: "Bearer valid.jwt.token",
      });
      const request = context.switchToHttp().getRequest();

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(jwtService.verifyAsync).toHaveBeenCalledWith("valid.jwt.token");
      expect(request.user).toEqual(decodedPayload);
    });

    it("should throw UnauthorizedException when no authorization header is present", async () => {
      const { guard, jwtService } = await setup();
      const context = createDefaultContext({});

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(jwtService.verifyAsync).not.toHaveBeenCalled();
    });

    it("should throw UnauthorizedException when the auth scheme is not Bearer", async () => {
      const { guard, jwtService } = await setup();
      const context = createDefaultContext({
        authorization: "Basic dXNlcjpwYXNz",
      });

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(jwtService.verifyAsync).not.toHaveBeenCalled();
    });

    it("should throw UnauthorizedException when the authorization header has no token", async () => {
      const { guard, jwtService } = await setup();
      const context = createDefaultContext({
        authorization: "Bearer",
      });

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(jwtService.verifyAsync).not.toHaveBeenCalled();
    });

    it("should throw UnauthorizedException when token verification fails", async () => {
      const { guard, jwtService } = await setup();
      vi.spyOn(jwtService, "verifyAsync").mockRejectedValue(
        new Error("invalid signature"),
      );

      const context = createDefaultContext({
        authorization: "Bearer invalid.jwt.token",
      });

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});

const createDefaultContext = (
  headers: Record<string, string> = {},
): ExecutionContext => {
  const request: any = { headers };
  return {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as ExecutionContext;
};

async function setup() {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      AuthGuard,
      {
        provide: JwtService,
        useValue: {
          signAsync: vi.fn(),
          verifyAsync: vi.fn(),
        },
      },
    ],
  }).compile();

  const guard = module.get(AuthGuard);
  const jwtService = module.get<JwtService>(JwtService);

  return {
    guard,
    jwtService,
  };
}
