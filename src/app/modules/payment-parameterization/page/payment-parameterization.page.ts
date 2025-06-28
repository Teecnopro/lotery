import { Component } from '@angular/core';
import { PaymentFormComponent } from '../components/payment-form/form.component';
import { PaymentTableComponent } from '../components/payment-table/table.component';
import { Subject } from 'rxjs';
import { PaymentParameterization } from '../../../domain/payment-parameterization/models/payment-parameterization.entity';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-parameterization-page',
  standalone: true,
  imports: [PaymentFormComponent, PaymentTableComponent, CommonModule],
  templateUrl: './payment-parameterization.page.html',
  styleUrls: ['./payment-parameterization.page.scss'],
})
export class PaymentParameterizationPageComponent {
  paymentObservable: Subject<PaymentParameterization> = new Subject<PaymentParameterization>();
}