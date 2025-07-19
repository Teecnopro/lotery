import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { USER_SERVICE } from '../../domain/users/ports';
import { FirebaseUserAdapter } from '../../infrastructure/users/firebase-user.adapter';
import {
  CreateUserUseCase,
  DeactivateUserUseCase,
  DeleteUserUseCase,
  GetUsersUseCase,
  UpdateUserUseCase,
} from '../../domain/users/use-cases';
import { LOG_BOOK_SERVICE } from '../../domain/logBook/ports';
import { LogBookUseCases } from '../../domain/logBook/use-cases/logBook.usecases';
import { LogBookAdapter } from '../../infrastructure/logBook/logBook.adapter';

@NgModule({
  imports: [CommonModule],
  providers: [
    {
      provide: USER_SERVICE,
      useClass: FirebaseUserAdapter,
    },
    {
      provide: LOG_BOOK_SERVICE,
      useClass: LogBookAdapter
    },
    LogBookUseCases,
    GetUsersUseCase,
    CreateUserUseCase,
    UpdateUserUseCase,
    DeactivateUserUseCase,
    DeleteUserUseCase,
  ],
})
export class UserModule {}
