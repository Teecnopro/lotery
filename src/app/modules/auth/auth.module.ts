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
import { PAYMENT_PARAMETERIZATION_SERVICE } from '../../domain/payment-parameterization/ports';
import { FirebasePaymentParameterizationAdapter } from '../../infrastructure/payment-parameterization/payment-parameterization.adapter';
import { PaymentParameterizationUseCase } from '../../domain/payment-parameterization/use-cases';
import { ALERT_PARAMETERIZATION_SERVICE } from '../../domain/alert-parameterization/ports';
import { FirebaseAlertParameterizationAdapter } from '../../infrastructure/alert-parameterization/alert-parameterization.adapter';
import { AlertParameterizationUseCase } from '../../domain/alert-parameterization/use-cases';

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

    {
      provide: PAYMENT_PARAMETERIZATION_SERVICE,
      useClass: FirebasePaymentParameterizationAdapter,
    },
    {
      provide: ALERT_PARAMETERIZATION_SERVICE,
      useClass: FirebaseAlertParameterizationAdapter,
    },
    AlertParameterizationUseCase,
    LoginUseCase,
    LogoutUseCase,
    RecoverPasswordUseCase,
    LoadUserProfileUseCase,
    PaymentParameterizationUseCase
  ],
})
export class AuthModule { }
