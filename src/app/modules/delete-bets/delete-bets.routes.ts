import { Routes } from '@angular/router';

export const routesDeleteBets: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/delete-bets.page').then((m) => m.DeleteBetsPage),
  },
];
