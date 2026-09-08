import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Query,
} from "@nestjs/common";

import {
  WebAuthnCredential,
  GenerateRegistrationOptionsOpts,
  generateRegistrationOptions,
  VerifiedRegistrationResponse,
  VerifyRegistrationResponseOpts,
  verifyRegistrationResponse,
  GenerateAuthenticationOptionsOpts,
  generateAuthenticationOptions,
  VerifiedAuthenticationResponse,
  VerifyAuthenticationResponseOpts,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server";
import { UserService } from "./user.service.js";
import { ConfigService } from "@nestjs/config";
import { AuthenticationService } from "./authentication.service.js";

@Controller("webauthn")
export class WebAuthNController {
  private readonly rpName: string;
  private readonly rpID: string;
  private readonly expectedOrigin: string[];

  constructor(
    @Inject(CACHE_MANAGER) private cache: Cache,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly authenticationService: AuthenticationService,
  ) {
    this.rpName = this.configService.get<string>("webauthn.rpName")!;
    this.rpID = this.configService.get<string>("webauthn.rpID")!;
    this.expectedOrigin = this.configService.get<string[]>(
      "webauthn.expectedOrigin",
    )!;
  }

  @Get("/generate-registration-options")
  async generateRegistrationOptions(@Query("username") username: string) {
    const user = await this.userService.findOrCreate(username);

    const opts: GenerateRegistrationOptionsOpts = {
      rpName: this.rpName,
      rpID: this.rpID,
      userName: username,
      timeout: 60000,
      attestationType: "none",
      excludeCredentials: user.credentials.map((cred) => ({
        id: cred.id,
        type: "public-key",
        transports: cred.transports,
      })),
      authenticatorSelection: {
        residentKey: "discouraged",
        userVerification: "preferred",
      },
      supportedAlgorithmIDs: [-7, -257],
    };

    const options = await generateRegistrationOptions(opts);
    await this.cache.set(`challenge:${username}`, options.challenge, 60_000);
    return options;
  }

  @Post("/verify-registration")
  async verifyRegistration(
    @Body() body: any,
    @Query("username") username: string,
  ) {
    const expectedChallenge = await this.cache.get<string>(
      `challenge:${username}`,
    );

    let verification: VerifiedRegistrationResponse;
    try {
      const opts: VerifyRegistrationResponseOpts = {
        response: body,
        expectedChallenge: `${expectedChallenge}`,
        expectedOrigin: this.expectedOrigin,
        expectedRPID: this.rpID,
        requireUserVerification: false,
      };
      verification = await verifyRegistrationResponse(opts);
    } catch (error) {
      const _error = error as Error;
      console.error(_error);
      throw new HttpException(_error.message, HttpStatus.BAD_REQUEST);
    }

    const { verified, registrationInfo } = verification;

    if (verified && registrationInfo) {
      await this.userService.addCredential(username, {
        ...registrationInfo.credential,
        transports: body.response.transports ?? [],
      });
    }
    await this.cache.del(`challenge:${username}`);
    const user = await this.userService.findByUsername(username);
    const jwt = await this.authenticationService.generateAccessToken(user!);
    return { verified, jwt };
  }

  @Get("/generate-authentication-options")
  async generateAuthenticationOptions(@Query("username") username: string) {
    const user = await this.userService.findByUsernameOrThrow(username);

    const opts: GenerateAuthenticationOptionsOpts = {
      timeout: 60000,
      allowCredentials: user.credentials.map((cred) => ({
        id: cred.id,
        type: "public-key",
        transports: cred.transports,
      })),
      userVerification: "preferred",
      rpID: this.rpID,
    };

    const options = await generateAuthenticationOptions(opts);
    await this.cache.set(`challenge:${username}`, options.challenge, 60_000);

    return options;
  }

  @Post("/verify-authentication")
  async verifyAuthentication(
    @Body() body: any,
    @Query("username") username: string,
  ) {
    const expectedChallenge = await this.cache.get<string>(
      `challenge:${username}`,
    );

    const dbCredential = await this.userService.findCredential(
      username,
      body.id,
    );
    if (!dbCredential) {
      throw new HttpException(
        "Authenticator is not registered with this site",
        HttpStatus.BAD_REQUEST,
      );
    }

    let verification: VerifiedAuthenticationResponse;
    try {
      const opts: VerifyAuthenticationResponseOpts = {
        response: body,
        expectedChallenge: `${expectedChallenge}`,
        expectedOrigin: this.expectedOrigin,
        expectedRPID: this.rpID,
        credential: {
          id: dbCredential.id,
          publicKey: new Uint8Array(dbCredential.publicKey),
          counter: dbCredential.counter,
          transports: dbCredential.transports,
        },
        requireUserVerification: false,
      };
      verification = await verifyAuthenticationResponse(opts);
    } catch (error) {
      const _error = error as Error;
      console.error(_error);
      throw new HttpException(_error.message, HttpStatus.BAD_REQUEST);
    }

    const { verified, authenticationInfo } = verification;

    if (verified) {
      await this.userService.updateCredentialCounter(
        username,
        dbCredential.id,
        authenticationInfo.newCounter,
      );
    }

    await this.cache.del(`challenge:${username}`);

    const user = await this.userService.findByUsername(username);
    const jwt = await this.authenticationService.generateAccessToken(user!);
    return { verified, jwt };
  }
}
