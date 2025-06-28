import { inject } from '@angular/core';

import { PAYMENT_PARAMETERIZATION_SERVICE } from '../ports';
import { PaymentParameterization } from '../models/payment-parameterization.entity';

export class PaymentParameterizationUseCase {
  private paymentParameterization = inject(PAYMENT_PARAMETERIZATION_SERVICE);
  createPaymentParameterization(data: PaymentParameterization): Promise<void> {
    return this.paymentParameterization.create(data);
  }
  updatePaymentParameterization(id: string, data: PaymentParameterization): Promise<void> {
    return this.paymentParameterization.update(id, data);
  }
  deletePaymentParameterization(id: string): Promise<void> {
    return this.paymentParameterization.delete(id);
  }
  getPaymentParameterization(id: string): Promise<PaymentParameterization | null> {
    return this.paymentParameterization.getByUid(id);
  }
  listPaymentParameterizations(): Promise<PaymentParameterization[]> {
    return this.paymentParameterization.getAll();
  }
}