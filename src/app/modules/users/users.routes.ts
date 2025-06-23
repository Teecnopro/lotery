import { Routes } from '@angular/router';

export const routesUsers: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./page/users-page.component').then((m) => m.UsersPageComponent),
  },
];
