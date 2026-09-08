import { Component, inject } from '@angular/core';
import { LoginForm } from '../../dumb_components/login-form/login-form';
import { WebauthnService } from '../../services/webautn.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Component({
  imports: [LoginForm],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly translateService = inject(TranslateService);
  private readonly webauthnService = inject(WebauthnService);

  async handleRegistration(username: string) {
    try {
      const verified = await this.webauthnService.register(username);
      if (verified) {
        this.router.navigate(['/home']);
      }
    } catch (e: any) {
      this.snackBar.open(this.translateService.translate('login.registrationFailed')());
    }
  }

  async handleLogin(username: string) {
    try {
      const verified = await this.webauthnService.login(username);
      if (verified) {
        this.router.navigate(['/home']);
      }
    } catch (e: any) {
      this.snackBar.open(this.translateService.translate('login.loginFailed')());
    }
  }
}
