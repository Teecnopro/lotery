import { Routes } from '@angular/router';

export const routesReports: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./page/reports.component').then((m) => m.ReportsComponent),
  },
];
