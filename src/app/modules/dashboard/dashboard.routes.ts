import { Routes } from '@angular/router';

import { authGuardGuard } from '../../core/guards/auth-guard.guard';

export const routesDashboard: Routes = [
  {
    path: 'dashboard',
    canActivate: [authGuardGuard],
    loadComponent: () =>
      import('./layout/dashboard-layout.component').then(
        (m) => m.DashboardLayoutComponent
      ),
    children: [
      /* Agregar los faltantes aca */
      {
        path: 'users',
        loadChildren: () =>
          import('../users/users.routes').then((m) => m.routesUsers),
      },
      {
        path: 'alert-parameterization',
        loadChildren: () =>
          import('../alert-parameterization/alert-parameterization.routes').then((m) => m.routesParameterizationWarnings),
      },
    ],
  },
];
