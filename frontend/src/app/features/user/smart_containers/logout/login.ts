import { Component, inject } from '@angular/core';
import { LoginForm } from '../../dumb_components/login-form/login-form';
import { WebauthnService } from '../../services/webautn.service';

@Component({
  imports: [LoginForm],
  selector: 'app-login',
  styleUrl: './logout.css',
  templateUrl: './logout.html',
})
export class Login {
  private readonly webauthnService = inject(WebauthnService);

  async handleRegistration(username: string) {
    try {
      const { verified } = await this.webauthnService.register(username);
      console.log(verified);
      alert(verified ? 'Passkey registered ✅' : 'Registration failed');
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    }
  }

  async handleLogin(username: string) {
    try {
      const { verified } = await this.webauthnService.login(username);
      console.log(verified);
      alert(verified ? 'Login Successfull✅' : 'Registration failed');
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    }
  }
}
