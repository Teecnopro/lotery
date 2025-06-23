
import { inject } from '@angular/core';

import { AUTH_SERVICE } from '../ports/auth-service.token';

export class LogoutUseCase {
   private authService = inject(AUTH_SERVICE);

  async execute() {
    return this.authService.logout();
  }
}
