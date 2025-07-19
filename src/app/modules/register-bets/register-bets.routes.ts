import { Routes } from '@angular/router';

export const routesRegisterBets: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/register-bets-page/register-bets-page.component').then((m) => m.RegisterBetsPageComponent),
  },
];
