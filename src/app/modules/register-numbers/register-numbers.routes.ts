import { Routes } from '@angular/router';

export const routesRegisterNumbers: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/register-numbers-page/register-numbers-page.component').then((m) => m.RegisterNumbersPageComponent),
  },
];
