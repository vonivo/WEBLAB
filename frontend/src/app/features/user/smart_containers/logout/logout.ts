import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../../authentication/auth.service';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-logout',
  styleUrl: './logout.css',
  templateUrl: './logout.html',
  imports: [MatProgressSpinnerModule],
})
export class Logout implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
