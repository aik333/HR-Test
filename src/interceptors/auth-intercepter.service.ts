import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
  authUrls = ['/login', '/signup']; // Modify with your auth API URLs

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Clone the request to modify
    let modifiedReq = req.clone();

    // Check if request URL matches an excluded auth API
    const isAuthUrl = this.authUrls.some(url => req.url.includes(url));


    // Added JWT token header
    if (!isAuthUrl) {
      const token = localStorage.getItem('access_token') || '';
      if (token) modifiedReq = modifiedReq.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }

    return next.handle(modifiedReq);

  }
}
