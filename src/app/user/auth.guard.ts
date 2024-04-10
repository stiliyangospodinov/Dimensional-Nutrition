import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.userService.user$.pipe(
      map(user => {
        const isLoggedIn = !!user;
        if (isLoggedIn) {
          // Redirect logged-in users away from login and register pages
          this.router.navigate(['/404']); // Пренасочване към профила за вече влезли потребители
        }
        return !isLoggedIn;
      })
    );
  }
}