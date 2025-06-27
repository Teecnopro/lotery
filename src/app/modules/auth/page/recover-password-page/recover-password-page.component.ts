import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { RecoveryPasswordFormComponent } from '../../components/recovery-password-form/recovery-password-form.component';

@Component({
  selector: 'app-recover-password-page',
  standalone: true,
  imports: [RecoveryPasswordFormComponent],
  template: ` <app-recovery-password-form
    (redirectLogin)="onRedirectToLogin()"
  ></app-recovery-password-form>`,
})
export class RecoverPasswordPageComponent {
  private router = inject(Router);

  onRedirectToLogin() {
    this.router.navigate(['auth/login']);
  }
}
