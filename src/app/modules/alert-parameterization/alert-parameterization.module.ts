import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FirebaseAlertParameterizationAdapter } from '../../infrastructure/alert-parameterization/alert-parameterization.adapter';
import { ALERT_PARAMETERIZATION_SERVICE } from '../../domain/alert-parameterization/ports';
import { AlertParameterizationUseCase } from '../../domain/alert-parameterization/use-cases';
import { LOG_BOOK_SERVICE } from '../../domain/logBook/ports';
import { LogBookAdapter } from '../../infrastructure/logBook/logBook.adapter';
import { LogBookUseCases } from '../../domain/logBook/use-cases/logBook.usecases';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  providers: [
    {
      provide: ALERT_PARAMETERIZATION_SERVICE,
      useClass: FirebaseAlertParameterizationAdapter,
    },
    {
      provide: LOG_BOOK_SERVICE,
      useClass: LogBookAdapter
    },
    LogBookUseCases,
    AlertParameterizationUseCase,
  ],
})
export class AlertParameterizationModule {
  
}
