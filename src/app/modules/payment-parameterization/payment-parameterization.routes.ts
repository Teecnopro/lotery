import { Routes } from '@angular/router';

export const routesPaymentParameterization: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./page/payment-parameterization.page').then((m) => m.PaymentParameterizationPageComponent),
  },
];
