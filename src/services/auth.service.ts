import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment.development';
import { User } from 'src/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  path: string = 'user';
  jwtHelper = inject(JwtHelperService);


  constructor(private http: HttpClient, private router: Router) { }

  // Signup API
  signUp(user: User) {
    return this.http.post(environment.SERVER_URL + this.path + '/signup', user);
  }

  // Login API
  login(authCreds: { email: string, password: string }) {
    return this.http.post(environment.SERVER_URL + this.path + '/login', authCreds);
  }

  // Helper Function to get user from local storage
  getUser() {
    return JSON.parse(localStorage.getItem('hrUser') || '{}');
  }

  // Helper function to verufy JWT
  verifyJWT(token: string) {
    return this.jwtHelper.isTokenExpired(token);
  }

  // Logout function
  logOut() {
    localStorage.removeItem('hrUser');
    localStorage.removeItem('access_token');
    this.router.navigate(['/auth']);
  }

}
