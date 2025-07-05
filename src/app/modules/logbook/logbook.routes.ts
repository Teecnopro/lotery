import { Routes } from '@angular/router';

export const routesLogBook: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./page/logbook.page').then((m) => m.LogBookPageComponent),
  },
];
