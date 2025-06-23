import { inject } from '@angular/core';

import { AUTH_SERVICE } from '../ports/auth-service.token';

export class RecoverPasswordUseCase {
  private authService = inject(AUTH_SERVICE);

  async execute(email: string) {
    return this.authService.recoverPassword(email);
  }
}
