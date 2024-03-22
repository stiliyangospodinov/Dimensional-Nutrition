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
  private user$$ = new BehaviorSubject<User | undefined>(undefined);
  public user$ = this.user$$.asObservable();
  user: User | undefined;
  USER_KEY = '[user]'
  get isLogged():boolean{
    return !!this.user
  }
  subscription: Subscription;
  constructor(private firestore: AngularFirestore, private auth: AngularFireAuth, private router:Router){
    this.subscription = this.user$.subscribe((user) => {
      this.user = user;
    });
  }
  async login(email: string, password: string): Promise<void> {
    try {
      const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
      const userId = userCredential.user?.uid;
      if (userId) {
        const userDoc = this.firestore.collection('users').doc(userId);
        const userDocSnapshot = await userDoc.get().toPromise();
        if (userDocSnapshot && userDocSnapshot.exists) {
          const userData = userDocSnapshot.data() as User; // Предполагаме, че типът на данните на потребителя е User
          this.user$$.next(userData); // Актуализиране на потребителските данни
        }
      }
    } catch (error) {
      window.alert('Incorrect Email or Password');
      throw error;
    }
  }
  
  register(username: string, email: string, tel: string, password: string, rePassword: string): void {
    this.auth.fetchSignInMethodsForEmail(email).then((methods) => {
      if (methods.length === 0) {
        // Няма съществуващ акаунт с този имейл
        this.auth.createUserWithEmailAndPassword(email, password).then(userCredential => {
          const userId = userCredential?.user?.uid;
          if (userId) {
            from(this.firestore.collection('users').doc(userId).set({
              username,
              email,
              tel,
            })).pipe(
              tap(() => {
                this.user$$.next({ username, email, tel, password, rePassword });
              })
            ).subscribe({
              next: () => {
                console.log('Registration successful');
              },
              error: (error) => {
                window.alert('Registration failed');
                throw error;
              }
            });
          }
        }).catch(error => {
          console.error('Registration failed:', error);
          throw error;
        });
      } else {
        // Има съществуващ акаунт с този имейл
        window.alert('An account with this email already exists.');
      }
    }).catch(error => {
      console.error('Error checking email existence:', error);
    });
  }
  logout() {
    return from(this.auth.signOut()).pipe(
      tap(() => {
        this.user$$.next(undefined); // Нулиране на потребителските данни
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
        throw error; // Разпространяваме грешката надолу
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}


