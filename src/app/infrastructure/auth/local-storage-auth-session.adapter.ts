import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { AuthSessionPort } from '../../domain/auth/ports';
import { AuthUser } from '../../domain/auth/models/auth-user.entity';

const STORAGE_KEY = 'auth_user';

@Injectable({ providedIn: 'root' })
export class LocalStorageAuthSessionAdapter implements AuthSessionPort {
  private userSubject: BehaviorSubject<AuthUser | null>;

  constructor() {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? (JSON.parse(stored) as AuthUser) : null;
    this.userSubject = new BehaviorSubject<AuthUser | null>(parsed);
  }

  setUser(user: AuthUser): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    this.userSubject.next(user);
  }

  getUser(): AuthUser | null {
    return this.userSubject.value;
  }

  getUser$(): Observable<AuthUser | null> | null {
    return this.userSubject.asObservable();
  }

  clearUser(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.userSubject.next(null);
  }
}
