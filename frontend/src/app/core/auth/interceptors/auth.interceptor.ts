import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './../services/auth.service'; // Ensure correct path

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getAccessToken();

    console.log("Intercepting request:", req); // Log the request
    console.log("Access Token:", token); // Log the token

    if (token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`, // Add token in Authorization header
        },
      });
      return next.handle(cloned);
    }

    return next.handle(req);
  }
}
