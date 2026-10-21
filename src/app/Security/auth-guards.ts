import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth-service';


//createUrlTree no navega: solo construye la dirección a la que se debe ir.

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.hasValidSession() ? true : router.createUrlTree(['']);
};

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.hasValidSession()) return router.createUrlTree(['']);
  return auth.isAdmin() ? true : router.createUrlTree(['/Pulperia']); // adonde mandar a quien no es admin
};
