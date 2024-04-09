import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GuestAuthGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.userService.user$.pipe(
      map(user => {
        const isLoggedIn = !!user;
        if (!isLoggedIn) {
          // Redirect non-logged-in users to 404 page
          this.router.navigate(['/404']); // Пренасочване към страницата с грешка за нелогнати потребители
        }
        return isLoggedIn;
      })
    );
  }
}