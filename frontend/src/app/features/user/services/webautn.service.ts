import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {
  startRegistration,
  startAuthentication,
  type RegistrationResponseJSON,
  type AuthenticationResponseJSON,
} from '@simplewebauthn/browser';
import type {
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from '@simplewebauthn/types';
import { AuthService } from '../../../authentication/auth.service';
import { AuthenticationResult } from '../../../authentication/auth.types';

@Injectable({ providedIn: 'root' })
export class WebauthnService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  async register(username: string): Promise<{ verified: boolean }> {
    const options = await firstValueFrom(
      this.http.get<PublicKeyCredentialCreationOptionsJSON>(
        '/api/webauthn/generate-registration-options',
        { params: { username }, withCredentials: true },
      ),
    );

    let attResp: RegistrationResponseJSON;
    try {
      attResp = await startRegistration({ optionsJSON: options });
    } catch (err) {
      throw err;
    }

    const authResult = await firstValueFrom(
      this.http.post<AuthenticationResult>('/api/webauthn/verify-registration', attResp, {
        params: { username },
        withCredentials: true,
      }),
    );

    if (authResult.verified) {
      this.authService.setToken(authResult.jwt);
    }

    return { verified: authResult.verified };
  }

  async login(username: string): Promise<{ verified: boolean }> {
    const options = await firstValueFrom(
      this.http.get<PublicKeyCredentialRequestOptionsJSON>(
        '/api/webauthn/generate-authentication-options',
        { params: { username }, withCredentials: true },
      ),
    );

    let asseResp: AuthenticationResponseJSON;
    try {
      asseResp = await startAuthentication({ optionsJSON: options });
    } catch (err) {
      throw err;
    }

    const authResult = await firstValueFrom(
      this.http.post<AuthenticationResult>('/api/webauthn/verify-authentication', asseResp, {
        params: { username },
        withCredentials: true,
      }),
    );

    if (authResult.verified) {
      this.authService.setToken(authResult.jwt);
    }

    return { verified: authResult.verified };
  }
}
