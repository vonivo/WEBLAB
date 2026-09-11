import { Component, model, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { form, FormField, required } from '@angular/forms/signals';

interface LoginData {
  username: string;
}

@Component({
  imports: [MatButton, MatFormField, MatLabel, TranslatePipe, MatInput, FormField, MatError],
  selector: 'app-login-form',
  styleUrl: './login-form.css',
  templateUrl: './login-form.html',
})
export class LoginForm {
  onRegister = output<string>();
  onLogin = output<string>();

  readonly loginModel = model<LoginData>({
    username: '',
  });
  readonly loginForm = form(this.loginModel, (shemaPath) => {
    required(shemaPath.username, { message: 'generic.required' });
  });

  handleRegistrationClick(event: Event) {
    event.preventDefault();
    this.loginForm().markAsTouched();
    if (this.loginForm().valid()) {
      this.onRegister.emit(this.loginModel().username);
    }
  }

  handleLoginClick(event: Event) {
    event.preventDefault();
    this.loginForm().markAsTouched();
    if (this.loginForm().valid()) {
      this.onLogin.emit(this.loginModel().username);
    }
  }
}
