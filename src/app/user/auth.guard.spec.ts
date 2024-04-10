import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { UserService } from './user.service';
import { of } from 'rxjs';

describe('AuthGuard', () => {
  let guard: AuthGuard;
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
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
