import { Routes } from '@angular/router';
import { SellerPageComponent } from './pages/seller.page';

export const routesSeller: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/seller.page').then((m) => m.SellerPageComponent),
  },
];