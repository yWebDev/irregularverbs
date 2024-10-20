import { Routes } from '@angular/router';
import canAuthorize from './guards/authorization.guard';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/search/search.component').then(
        (m) => m.SearchComponent,
      ),
  },
  {
    path: 'game',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/game/game-promo/game-promo.component').then(
            (m) => m.GamePromoComponent,
          ),
        canActivate: [canAuthorize],
      },
      {
        path: 'active',
        loadComponent: () =>
          import('./components/game/game.component').then(
            (m) => m.GameComponent,
          ),
        canActivate: [canAuthorize],
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./components/game/login/login.component').then(
            (m) => m.LoginComponent,
          ),
      },
    ],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

export default routes;
