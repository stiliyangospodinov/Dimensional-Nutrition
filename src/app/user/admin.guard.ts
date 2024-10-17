import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.userService.user$.pipe(
      map(user => {
        const isAdmin = !!user && this.userService.isAdmin();
        if (!isAdmin) {
          
          this.router.navigate(['/']); 
        }
        return isAdmin; 
      })
    );
  }
}
