import { inject } from '@angular/core';

import { PAYMENT_PARAMETERIZATION_SERVICE } from '../ports';

export class PaymentParameterizationUseCase {
  private paymentParameterization = inject(PAYMENT_PARAMETERIZATION_SERVICE);
}