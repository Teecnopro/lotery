import { inject } from '@angular/core';

import { FirebaseError } from '@angular/fire/app';

import { AUTH_SERVICE } from '../ports';
import { LoadUserProfileUseCase } from '../../users/use-cases';

export class LoginUseCase {
  private authService = inject(AUTH_SERVICE);
  private loadUserProfile = inject(LoadUserProfileUseCase);

  async execute(email: string, password: string) {
    const user = await this.authService.login(email, password);
    const profile = await this.loadUserProfile.execute(user?.uid!);

    if (!profile.state) {
      await this.authService.logout();
      throw new FirebaseError('auth/user-disabled', 'Usuario desactivado.');
    }

    return profile;
  }
}
