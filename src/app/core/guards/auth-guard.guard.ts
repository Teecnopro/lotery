import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { Auth, onAuthStateChanged } from '@angular/fire/auth';

export const authGuardGuard: CanActivateFn = async () => {
  const auth = inject(Auth);
  const router = inject(Router);
  return new Promise<boolean>((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(true);
      } else {
        router.navigate(['/auth/login']);
        resolve(false);
      }
    });
  });
};
