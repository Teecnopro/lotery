import { Routes } from '@angular/router';
import { routesAuth } from './modules/auth/aut.routes';
import { routesDashboard } from './modules/dashboard/dashboard.routes';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  ...routesAuth,
  ...routesDashboard,
];
