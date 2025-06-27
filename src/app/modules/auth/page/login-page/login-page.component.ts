import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { LoginFormComponent } from '../../components/login-form/login-form.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [LoginFormComponent],
  template: `
    <app-login-form
      (loginSuccess)="onLoginSuccess()"
      (recoverPassword)="onRecoverPassword()"
    ></app-login-form>
  `,
})
export class LoginPageComponent {
  private router = inject(Router);

  onLoginSuccess() {
    this.router.navigate(['/dashboard']);
  }

  onRecoverPassword() {
    this.router.navigate(['/auth/recover-password']);
  }
}
