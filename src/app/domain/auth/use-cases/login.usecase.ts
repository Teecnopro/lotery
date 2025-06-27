import { inject } from '@angular/core';

import { AUTH_SERVICE, AUTH_SESSION } from '../ports';
import { LoadUserProfileUseCase } from '../../users/use-cases';

export class LoginUseCase {
  private authService = inject(AUTH_SERVICE);
  private loadUserProfile = inject(LoadUserProfileUseCase);

  async execute(email: string, password: string) {
    const user = await this.authService.login(email, password);
    const profile = await this.loadUserProfile.execute(user?.uid!);
    return profile;
  }
}
