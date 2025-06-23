import { inject } from '@angular/core';

import { AUTH_SERVICE, AUTH_SESSION } from '../ports';

export class LoginUseCase {
  private authService = inject(AUTH_SERVICE);
  private authSesion = inject(AUTH_SESSION);

  async execute(email: string, password: string) {
    const user = await this.authService.login(email, password);
    this.authSesion.setUser({
      uid: user?.uid,
      email: user?.email,
    });
    return user;
  }
}
