import { Component } from '@angular/core';
import { PaymentFormComponent } from '../components/payment-form/form.component';

@Component({
  selector: 'app-payment-parameterization-page',
  standalone: true,
  imports: [PaymentFormComponent],
  templateUrl: './payment-parameterization.page.html',
  styleUrls: ['./payment-parameterization.page.scss'],
})
export class PaymentParameterizationPageComponent {}