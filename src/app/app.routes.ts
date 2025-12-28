import { Routes } from '@angular/router';
import { DashboardPage } from './gifs/pages/dashboard-page/dashboard-page';

export const routes: Routes = [
  {
    path: 'dashboard',
    /* esto es para lazy loading,e s decir que se cargue el componente cuando se vaya a usar (bajo demanda) */
    loadComponent: () =>
      import('./gifs/pages/dashboard-page/dashboard-page').then((m) => m.DashboardPage),

    /* children es para definir las rutas hijas de la ruta padre */
    children: [
      {
        path: 'trending',
        loadComponent: () =>
          import('./gifs/pages/trending-page/trending-page').then((m) => m.TrendingPage),
      },
      {
        path: 'search',
        loadComponent: () =>
          import('./gifs/pages/search-page/search-page').then((m) => m.SearchPage),
      },
      {
        path: '**',
        redirectTo: 'trending',
      },
    ],
  },

  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
