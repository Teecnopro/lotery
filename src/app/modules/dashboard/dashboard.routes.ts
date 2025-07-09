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
      {
        path: '',
        loadComponent: () =>
          import('./components/dashboard-home.component').then(
            (m) => m.DashboardHomeComponent
          ),
        data: { title: 'Inicio' },
      },
      {
        path: 'users',
        loadChildren: () =>
          import('../users/users.routes').then((m) => m.routesUsers),
        data: {
          title: 'Usuarios',
        },
      },
      {
        path: 'alert-parameterization',
        loadChildren: () =>
          import(
            '../alert-parameterization/alert-parameterization.routes'
          ).then((m) => m.routesAlertParameterization),
        data: {
          title: 'Parametrización de alertas',
        },
      },
      {
        path: 'payment-parameterization',
        loadChildren: () =>
          import(
            '../payment-parameterization/payment-parameterization.routes'
          ).then((m) => m.routesPaymentParameterization),
        data: {
          title: 'Parametrización de pagos',
        },
      },
      {
        path: 'register-bets',
        loadChildren: () =>
          import('../register-bets/register-bets.routes').then(
            (m) => m.routesRegisterBets
          ),
        data: {
          title: 'Registrar apuestas',
        },
      },
      {
        path: 'vendors',
        loadChildren: () =>
          import('../sellers/seller.routes').then((m) => m.routesSeller),
        data: {
          title: 'Vendedores',
        },
      },
      {
        path: 'check-hits',
        loadChildren: () =>
          import('../check-hits/check-hits.routes').then(
            (m) => m.routesCheckHits
          ),
        data: {
          title: 'Consultar aciertos',
        },
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('../reports/reports.routes').then((m) => m.routesReports),
        data: {
          title: 'Reportes',
        },
      },
      {
        path: 'logbook',
        loadChildren: () =>
          import('../logbook/logbook.routes').then((m) => m.routesLogBook),
        data: {
          title: 'Bitacora',
        },
      },
    ],
  },
];
