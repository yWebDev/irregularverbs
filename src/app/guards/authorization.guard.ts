import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { selectIsAuthorized } from '../store/auth/auth.selectors';

const canAuthorize: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectIsAuthorized).pipe(
    take(1),
    map((isAuthorized) => isAuthorized || router.createUrlTree(['game', 'login'])),
  );
};

export default canAuthorize;
