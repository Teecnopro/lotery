import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { REGISTER_BETS_SERVICE } from '../../domain/register-bets/ports';
import { FirebaseRegisterBetsAdapter } from '../../infrastructure/register-bets/register-bets.adapter';
import { RegisterBetsUseCase } from '../../domain/register-bets/use-cases';
import { SELLER_REPOSITORY } from '../../domain/sellers/ports';
import { FirebaseSellerAdapter } from '../../infrastructure/sellers/firebase-seller.adapter';
import { ALERT_PARAMETERIZATION_SERVICE } from '../../domain/alert-parameterization/ports';
import { FirebaseAlertParameterizationAdapter } from '../../infrastructure/alert-parameterization/alert-parameterization.adapter';
import { SellerUseCase } from '../../domain/sellers/use-cases';
import { AlertParameterizationUseCase } from '../../domain/alert-parameterization/use-cases';
import { LOG_BOOK_SERVICE } from '../../domain/logBook/ports';
import { LogBookAdapter } from '../../infrastructure/logBook/logBook.adapter';
import { LogBookUseCases } from '../../domain/logBook/use-cases/logBook.usecases';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: REGISTER_BETS_SERVICE,
      useClass: FirebaseRegisterBetsAdapter
    },
    {
      provide: SELLER_REPOSITORY,
      useClass: FirebaseSellerAdapter
    },
    {
      provide: ALERT_PARAMETERIZATION_SERVICE,
      useClass: FirebaseAlertParameterizationAdapter // Assuming FirebaseSellerAdapter implements ALERT_PARAMETERIZATION_SERVICE
    },
    {
      provide: LOG_BOOK_SERVICE,
      useClass: LogBookAdapter
    },
    LogBookUseCases,
    RegisterBetsUseCase,
    SellerUseCase,
    AlertParameterizationUseCase
  ]
})
export class RegisterBetsModule { }
