import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanActivateFn
} from '@angular/router';
import { AuthService } from 'src/services/auth.service';

// Auth Guard to prevent unauthorized acess
export const AuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {

  // Injecting required services
  const authService = inject(AuthService);
  const router = inject(Router);

  // Getiing required data from local storage
  const loggedInUser = authService.getUser();
  const token = localStorage.getItem('access_token') || '';

  // If user is not logged in
  if (!loggedInUser || !token) {
    router.navigate(['/auth'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // Checking token expiry
  if (token && !authService.verifyJWT(token)) {
    return true;
  } else {
    // Token is expired, clearing local storage and redirecting to auth
    authService.logOut();
    return false;
  }
}