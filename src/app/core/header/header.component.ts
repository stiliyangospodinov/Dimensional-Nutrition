import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  menuOpen = false;
  isMenuVisible = true; 

  constructor(private userService: UserService, private router: Router) {}

  get isLoggedIn(): boolean {
    return this.userService.isLogged;
  }

  get username(): string {
    return this.userService.user?.username || '';
  }

  get isAdmin(): boolean {
    return this.userService.isAdmin();
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  logout(): void {
    this.userService.logout().subscribe(() => {
      this.router.navigate(['/']);
    });
  }

  ngOnInit() {
    this.updateMenuVisibility();
    window.addEventListener('resize', this.updateMenuVisibility.bind(this));
  }

  private updateMenuVisibility(): void {
    this.isMenuVisible = window.innerWidth < 1024; 
  }

  @HostListener('document:click', ['$event'])
  handleClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const menu = document.querySelector('.menu');
    const toggleButton = document.querySelector('.menu-toggle');

    if (this.menuOpen && menu && toggleButton && !menu.contains(target) && !toggleButton.contains(target)) {
      this.menuOpen = false;
    }
  }
}
