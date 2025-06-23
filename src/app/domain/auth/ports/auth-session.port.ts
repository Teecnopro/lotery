import { Observable } from 'rxjs';

import { AuthUser } from '../models/auth-user.entity';

export abstract class AuthSessionPort {
  abstract setUser(user: AuthUser): void;
  abstract getUser(): AuthUser | null;
  abstract getUser$(): Observable<AuthUser | null> | null;
  abstract clearUser(): void;
}
