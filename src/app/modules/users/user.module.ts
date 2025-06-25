import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { USER_SERVICE } from '../../domain/users/ports';
import { FirebaseUserAdapter } from '../../infrastructure/users/firebase-user.adapter';
import { GetUsersUseCase } from '../../domain/users/use-cases';

@NgModule({
  imports: [CommonModule],
  providers: [
    {
      provide: USER_SERVICE,
      useClass: FirebaseUserAdapter,
    },
    GetUsersUseCase,
  ],
})
export class UserModule {}
