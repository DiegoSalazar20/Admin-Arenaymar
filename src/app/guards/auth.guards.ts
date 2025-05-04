import { inject, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  exp: number;
}

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  
  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decodificado: TokenPayload = jwtDecode(token);
        const horaActual = Math.floor(Date.now() / 1000);

        if (decodificado.exp && decodificado.exp > horaActual) {
          return true;
        }
      } catch (err) {
        console.error('Error con el token:', err);
      }

      localStorage.removeItem('token');
    }
  }
    router.navigate(['/']);
    return false;
  

  
};
