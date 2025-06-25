import { Routes } from '@angular/router';

export const routesParameterizationWarnings: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./page/alert-parameterization.page').then((m) => m.ParameterizationWarningsPageComponent),
  },
];
