import { Routes } from '@angular/router';

export const routesAuth: Routes = [
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./page/login-page/login-page.component').then(
        (m) => m.LoginPageComponent
      ),
  },
  {
    path: 'auth/recover-password',
    loadComponent: () =>
      import(
        './page/recover-password-page/recover-password-page.component'
      ).then((m) => m.RecoverPasswordPageComponent),
  },
];
