import { Injectable } from '@angular/core';

import {
  Auth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  deleteUser
} from '@angular/fire/auth';

import { AuthServicePort } from '../../domain/auth/ports/auth-service.port';
import { AuthUser } from '../../domain/auth/models/auth-user.entity';

@Injectable({ providedIn: 'root' })
export class FirebaseAuthAdapter implements AuthServicePort {
  constructor(private auth: Auth) {}

  async login(email: string, password: string): Promise<AuthUser> {
    const result = await signInWithEmailAndPassword(this.auth, email, password);
    return result.user;
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  async recoverPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(this.auth, email);
  }
}
