import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PaymentFormComponent } from './components/payment-form/form.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule,PaymentFormComponent],
  providers: [],
})
export class PaymentParameterizationModule {}