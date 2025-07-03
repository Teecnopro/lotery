import { Routes } from '@angular/router';

export const routesCheckHits: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./page/check-hits.page').then((m) => m.CheckHitsPage),
    }
];