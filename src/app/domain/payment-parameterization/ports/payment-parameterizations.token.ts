import { InjectionToken } from '@angular/core';

import { PaymentParameterizationServicePort } from './payment-parameterization.port';

export const PAYMENT_PARAMETERIZATION_SERVICE = new InjectionToken<PaymentParameterizationServicePort>(
  'PaymentParameterizationServicePort'
);