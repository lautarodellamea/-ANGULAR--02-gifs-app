import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    /* esto es para lazy loading,e s decir que se cargue el componente cuando se vaya a usar (bajo demanda) */
    loadComponent: () => import('./gifs/pages/dashboard-page/dashboard-page'),

    /* children es para definir las rutas hijas de la ruta padre */
    children: [
      {
        path: 'trending',
        loadComponent: () => import('./gifs/pages/trending-page/trending-page'),
      },
      {
        path: 'search',
        loadComponent: () => import('./gifs/pages/search-page/search-page'),
      },
      {
        path: 'history/:query',
        loadComponent: () => import('./gifs/pages/gif-history-page/gif-history-page'),
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
