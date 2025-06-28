import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PaymentFormComponent } from './components/payment-form/form.component';
import { PAYMENT_PARAMETERIZATION_SERVICE } from '../../domain/payment-parameterization/ports';
import { FirebasePaymentParameterizationAdapter } from '../../infrastructure/payment-parameterization/payment-parameterization.adapter';
import { PaymentParameterizationUseCase } from '../../domain/payment-parameterization/use-cases';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule,PaymentFormComponent],
  providers: [
      {
        provide: PAYMENT_PARAMETERIZATION_SERVICE,
        useClass: FirebasePaymentParameterizationAdapter,
      },
      PaymentParameterizationUseCase
    ],
})
export class PaymentParameterizationModule {}