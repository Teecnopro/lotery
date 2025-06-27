import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { FirebaseAuthAdapter } from '../../infrastructure/auth/firebase-auth.adapter';
import { AUTH_SERVICE } from '../../domain/auth/ports/auth-service.token';
import {
  LoginUseCase,
  LogoutUseCase,
  RecoverPasswordUseCase,
} from '../../domain/auth/use-cases';
import { AUTH_SESSION } from '../../domain/auth/ports';
import { LocalStorageAuthSessionAdapter } from '../../infrastructure/auth/local-storage-auth-session.adapter';
import { LoadUserProfileUseCase } from '../../domain/users/use-cases';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  providers: [
    {
      provide: AUTH_SERVICE,
      useClass: FirebaseAuthAdapter,
    },
    {
      provide: AUTH_SESSION,
      useClass: LocalStorageAuthSessionAdapter,
    },
    LoginUseCase,
    LogoutUseCase,
    RecoverPasswordUseCase,
    LoadUserProfileUseCase,
  ],
})
export class AuthModule {}
