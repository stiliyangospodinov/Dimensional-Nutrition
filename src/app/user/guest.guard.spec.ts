import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { GuestAuthGuard } from './guest.guard'; // Промени guest-guard на guest-auth.guard
import { UserService } from './user.service';
import { of } from 'rxjs';

describe('GuestAuthGuard', () => { // Промени guestGuard на GuestAuthGuard
  let guard: GuestAuthGuard; // Промени guestGuard на GuestAuthGuard
  let userServiceStub: Partial<UserService>;

  beforeEach(() => {
    userServiceStub = {
      user$: of(undefined) // Мокване на user$ observable с помощта на RxJS of оператор
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: UserService, useValue: userServiceStub },
        Router
      ]
    });
    guard = TestBed.inject(GuestAuthGuard); // Промени guestGuard на GuestAuthGuard
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
