import { Component } from '@angular/core';
import { PaymentFormComponent } from '../components/payment-form/form.component';
import { PaymentTableComponent } from '../components/payment-table/table.component';
import { Subject } from 'rxjs';
import { PaymentParameterization } from '../../../domain/payment-parameterization/models/payment-parameterization.entity';
import { CommonModule } from '@angular/common';
import { PAYMENT_PARAMETERIZATION_SERVICE } from '../../../domain/payment-parameterization/ports';
import { FirebasePaymentParameterizationAdapter } from '../../../infrastructure/payment-parameterization/payment-parameterization.adapter';
import { PaymentParameterizationUseCase } from '../../../domain/payment-parameterization/use-cases';
import { NOTIFICATION_PORT } from '../../../shared/ports';
import { MaterialNotificationAdapter } from '../../../shared/infrastructure/matsnackbar-notification.adapter';
import { MaterialModule } from '../../../shared/material/material.module';

@Component({
  selector: 'app-payment-parameterization-page',
  standalone: true,
  imports: [PaymentFormComponent, PaymentTableComponent, CommonModule, MaterialModule],
  providers: [
    {
      provide: PAYMENT_PARAMETERIZATION_SERVICE,
      useClass: FirebasePaymentParameterizationAdapter,
    },
    {
      provide: NOTIFICATION_PORT,
      useClass: MaterialNotificationAdapter,
    },
    PaymentParameterizationUseCase,
  ],
  templateUrl: './payment-parameterization.page.html',
  styleUrls: ['./payment-parameterization.page.scss'],
})
export class PaymentParameterizationPageComponent {
  paymentObservable: Subject<PaymentParameterization> = new Subject<PaymentParameterization>();
  updateTable: Subject<boolean> = new Subject<boolean>();
  showForm: boolean = false;
  isMobile: boolean = false;

  toggleForm() {
    this.showForm = !this.showForm;
  }
}