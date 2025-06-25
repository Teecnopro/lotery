import { Routes } from '@angular/router';

export const routesParameterizationWarnings: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./page/parameterization_warnings.page').then((m) => m.ParameterizationWarningsPageComponent),
  },
];
