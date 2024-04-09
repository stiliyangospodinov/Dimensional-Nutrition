import { Injectable, OnDestroy } from '@angular/core';
import { User } from '../types/user';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription, from, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService implements OnDestroy {
  private user$$ = new BehaviorSubject<User | undefined>(this.retrieveUserFromSessionStorage());
  public user$: Observable<User | undefined> = this.user$$.asObservable();
  user: User | undefined;
  USER_KEY = '[user]';
  get isLogged(): boolean {
    return !!this.user;
  }
  subscription: Subscription;

  constructor(private firestore: AngularFirestore, private auth: AngularFireAuth, private router: Router) {
    this.subscription = this.user$.subscribe((user) => {
      this.user = user;
    });
  }

  private retrieveUserFromSessionStorage(): User | undefined {
    const userJson = sessionStorage.getItem('user');
    return userJson ? JSON.parse(userJson) as User : undefined;
  }

  async login(email: string, password: string): Promise<void> {
    try {
      const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
      const userId = userCredential.user?.uid;
      if (userId) {
        const userData = await this.getUserDataFromFirestore(userId);
        this.user$$.next(userData);
        sessionStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (error) {
      window.alert('Incorrect Email or Password');
      throw error;
    }
  }

  async getUserDataFromFirestore(userId: string): Promise<User> {
    const userDoc = this.firestore.collection('users').doc(userId);
    const userDocSnapshot = await userDoc.get().toPromise();
    if (userDocSnapshot && userDocSnapshot.exists) {
      return userDocSnapshot.data() as User;
    } else {
      throw new Error('User data not found in Firestore');
    }
  }

  async register(username: string, email: string, tel: string, password: string, rePassword: string): Promise<void> {
    try {
      const methods = await this.auth.fetchSignInMethodsForEmail(email);
      if (methods.length === 0) {
        const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
        const userId = userCredential?.user?.uid;
        if (userId) {
          await this.firestore.collection('users').doc(userId).set({
            username,
            email,
            tel,
          });
          const userData = { username, email, tel, password, rePassword };
          this.user$$.next(userData);
        }
      } else {
        window.alert('An account with this email already exists.');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  async checkIfUserExists(email: string): Promise<boolean> {
    try {
      const methods = await this.auth.fetchSignInMethodsForEmail(email);
      return methods.length > 0;
    } catch (error) {
      console.error('Error checking if user exists:', error);
      throw error;
    }
  }

  logout(): Observable<void> {
    return from(this.auth.signOut()).pipe(
      tap(() => {
        sessionStorage.removeItem('user');
        this.user$$.next(undefined);
      }),
      catchError(error => {
        console.error('Error logging out:', error);
        throw error;
      })
    );
  }

  updateProfile(username: string, email: string, tel?: string): Observable<void> {
    return this.auth.authState.pipe(
      switchMap(user => {
        if (user) {
          const userId = user.uid;
          const profileData = { username, email, tel };
          const profileDoc = this.firestore.collection('users').doc(userId);
          return from(profileDoc.update(profileData)).pipe(
            catchError(error => {
              console.error('Error updating profile:', error);
              throw error;
            })
          );
        } else {
          throw new Error('No authenticated user');
        }
      }),
      catchError(error => {
        console.error('Error updating profile:', error);
        throw error;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

