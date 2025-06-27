import { inject } from '@angular/core';

import { PAYMENT_PARAMETERIZATION_SERVICE } from '../ports';
import { PaymentParameterization } from '../models/payment-parameterization.entity';

export class PaymentParameterizationUseCase {
  private paymentParameterization = inject(PAYMENT_PARAMETERIZATION_SERVICE);
  createPaymentParameterization(data: PaymentParameterization): Promise<any> {
    return this.paymentParameterization.createPaymentParameterization(data);
  }
  updatePaymentParameterization(id: string, data: PaymentParameterization): Promise<any> {
    return this.paymentParameterization.updatePaymentParameterization(id, data);
  }
  deletePaymentParameterization(id: string): Promise<void> {
    return this.paymentParameterization.deletePaymentParameterization(id);
  }
  getPaymentParameterization(id: string): Promise<PaymentParameterization | null> {
    return this.paymentParameterization.getPaymentParameterization(id);
  }
  listPaymentParameterizations(): Promise<PaymentParameterization[]> {
    return this.paymentParameterization.listPaymentParameterizations();
  }
}