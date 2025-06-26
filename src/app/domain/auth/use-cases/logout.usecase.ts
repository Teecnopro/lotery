import { inject } from '@angular/core';

import { AUTH_SERVICE, AUTH_SESSION } from '../ports';

export class LogoutUseCase {
  private authService = inject(AUTH_SERVICE);
  private authSesion = inject(AUTH_SESSION);

  async execute() {
    await this.authService.logout();
    this.authSesion.clearUser();
    return;
  }
}
