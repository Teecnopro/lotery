import { Routes } from '@angular/router';

export const routesAlertParameterization: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./page/alert-parameterization.page').then((m) => m.AlertParameterizationPageComponent),
  },
];
