import { Component } from '@angular/core';
import { PaymentFormComponent } from '../components/payment-form/form.component';
import { PaymentTableComponent } from '../components/payment-table/table.component';

@Component({
  selector: 'app-payment-parameterization-page',
  standalone: true,
  imports: [PaymentFormComponent, PaymentTableComponent],
  templateUrl: './payment-parameterization.page.html',
  styleUrls: ['./payment-parameterization.page.scss'],
})
export class PaymentParameterizationPageComponent {}