import { inject } from '@angular/core';

import { PAYMENT_PARAMETERIZATION_SERVICE } from '../ports';

export class PaymentParameterizationUseCase {
  private paymentParameterization = inject(PAYMENT_PARAMETERIZATION_SERVICE);
  createPaymentParameterization(data: any): Promise<any> {
    return this.paymentParameterization.createPaymentParameterization(data);
  }
  updatePaymentParameterization(id: string, data: any): Promise<any> {
    return this.paymentParameterization.updatePaymentParameterization(id, data);
  }
  deletePaymentParameterization(id: string): Promise<void> {
    return this.paymentParameterization.deletePaymentParameterization(id);
  }
  getPaymentParameterization(id: string): Promise<any | null> {
    return this.paymentParameterization.getPaymentParameterization(id);
  }
  listPaymentParameterizations(): Promise<any[]> {
    return this.paymentParameterization.listPaymentParameterizations();
  }
  
}