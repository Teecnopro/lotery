import { inject } from '@angular/core';

import { Observable } from 'rxjs';

import { AUTH_SESSION } from '../ports';
import { AuthUser } from '../models/auth-user.entity';

export class AuthSessionUseCase {
  private authSession = inject(AUTH_SESSION);

  setSession(user: AuthUser): void {
    this.authSession.setUser(user);
  }

  getSession(): AuthUser | null {
    return this.authSession.getUser();
  }

  observeSession(): Observable<AuthUser | null> | null {
    return this.authSession.getUser$();
  }

  clearSession(): void {
    this.authSession.clearUser();
  }
}
