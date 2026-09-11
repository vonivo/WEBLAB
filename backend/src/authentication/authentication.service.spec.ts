import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { UserDocument } from "./user.schema.js";
import { AuthenticationService } from "./authentication.service.js";

describe("AuthenticationService", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should be defined", async () => {
    const { service } = await setup();
    expect(service).toBeDefined();
  });

  describe("generateAccessToken", () => {
    it("should generate an access token with the correct payload", async () => {
      const { service, jwtService } = await setup();
      const mockToken = "mocked.jwt.token";
      vi.spyOn(jwtService, "signAsync").mockResolvedValue(mockToken);

      const result = await service.generateAccessToken(mockUser);

      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser.id,
        username: mockUser.username,
      });
      expect(jwtService.signAsync).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ accessToken: mockToken });
    });

    it("should return an object with an accessToken property", async () => {
      const { service, jwtService } = await setup();
      vi.spyOn(jwtService, "signAsync").mockResolvedValue("some-token");

      const result = await service.generateAccessToken(mockUser);

      expect(result).toHaveProperty("accessToken");
    });
  });
});

const mockUser = {
  id: "user-id-123",
  username: "johndoe",
} as UserDocument;

async function setup() {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      AuthenticationService,
      {
        provide: JwtService,
        useValue: {
          signAsync: vi.fn(),
        },
      },
    ],
  }).compile();

  const service = module.get<AuthenticationService>(AuthenticationService);
  const jwtService = module.get<JwtService>(JwtService);

  return {
    service,
    jwtService,
  };
}
