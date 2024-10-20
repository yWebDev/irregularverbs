import { Routes } from '@angular/router';
import { GameComponent } from './components/game/game.component';
import { SearchComponent } from './components/search/search.component';
import { LoginComponent } from './components/game/login/login.component';
import { GamePromoComponent } from './components/game/game-promo/game-promo.component';
import canAuthorize from './guards/authorization.guard';

const routes: Routes = [
  {
    path: '',
    component: SearchComponent,
  },
  {
    path: 'game',
    children: [
      {
        path: '',
        component: GamePromoComponent,
        canActivate: [canAuthorize],
      },
      {
        path: 'active',
        component: GameComponent,
        canActivate: [canAuthorize],
      },
      {
        path: 'login',
        component: LoginComponent,
      },
    ],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

export default routes;
