import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './components/game/game.component';
import { SearchComponent } from './components/search/search.component';
import { LoginComponent } from './components/game/login/login.component';
import { AuthorizationGuard } from './guards/authorization.guard';

const routes: Routes = [
  {
    path: '',
    component: SearchComponent
  },
  {
    path: 'game',
    children: [
      {
        path: '',
        component: GameComponent,
        canActivate: [AuthorizationGuard]
      },
      {
        path: 'login',
        component: LoginComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
