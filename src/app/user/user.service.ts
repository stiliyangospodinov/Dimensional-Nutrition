import { Injectable, OnDestroy } from '@angular/core';
import { User } from '../types/user';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription, catchError, from, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService implements OnDestroy {
  private user$$ = new BehaviorSubject<User | undefined>(this.retrieveUserFromSessionStorage());
  public user$ = this.user$$.asObservable();
  user: User | undefined;
  USER_KEY = '[user]'
  get isLogged(): boolean {
    return !!this.user
  }
  subscription: Subscription;
  constructor(private firestore: AngularFirestore, private auth: AngularFireAuth, private router: Router) {
    this.subscription = this.user$.subscribe((user) => {
      this.user = user;
    });
  }
  private retrieveUserFromSessionStorage(): User | undefined {
    const userJson = sessionStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : undefined;
  }

  async login(email: string, password: string): Promise<void> {
    try {
      const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
      const userId = userCredential.user?.uid;
      if (userId) {
        const userDoc = this.firestore.collection('users').doc(userId);
        const userDocSnapshot = await userDoc.get().toPromise();
        if (userDocSnapshot && userDocSnapshot.exists) {
          const userData = userDocSnapshot.data() as User;
          this.user$$.next(userData);
          sessionStorage.setItem('user', JSON.stringify(userData));
        }
      }
    } catch (error) {
      window.alert('Incorrect Email or Password');
      throw error;
    }
  }
  register(username: string, email: string, tel: string, password: string, rePassword: string): Observable<void> {
    return new Observable<void>((observer) => {
      this.auth.fetchSignInMethodsForEmail(email).then((methods) => {
        if (methods.length === 0) {
          this.auth.createUserWithEmailAndPassword(email, password).then(userCredential => {
            const userId = userCredential?.user?.uid;
            if (userId) {
              const userData = { username, email, tel, password, rePassword };
              this.firestore.collection('users').doc(userId).set(userData)
                .then(() => {
                  observer.next();
                  observer.complete();
                })
                .catch(error => {
                  observer.error(error);
                });
            }
          }).catch(error => {
            observer.error(error); 
          });
        } else {
          observer.error('An account with this email already exists.');
        }
      }).catch(error => {
        observer.error(error); 
      });
    });
  }
  
  logout(): Observable<void> {
    return from(this.auth.signOut()).pipe(
      tap(() => {
        sessionStorage.removeItem('user');
        this.user$$.next(undefined);
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
          return from(profileDoc.update(profileData));
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