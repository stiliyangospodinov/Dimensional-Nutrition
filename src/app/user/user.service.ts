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
  private user$$ = new BehaviorSubject<User | undefined>(this.retrieveUserFromLocalStorage());
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
  private retrieveUserFromLocalStorage(): User | undefined {
    const userJson = localStorage.getItem('user');
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
          const userData = userDocSnapshot.data() as User; // Предполагаме, че типът на данните на потребителя е User
          this.user$$.next(userData);

        }
      }
    } catch (error) {
      window.alert('Incorrect Email or Password');
      throw error;
    }
  }
  
  register(username: string, email: string, tel: string, password: string, rePassword: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.auth.fetchSignInMethodsForEmail(email).then((methods) => {
        if (methods.length === 0) {
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
                  resolve(); 
                },
                error: (error) => {
                  console.error('Registration failed:', error);
                  reject(error);
                }
              });
            }
          }).catch(error => {
            console.error('Registration failed:', error);
            reject(error); 
          });
        } else {
          window.alert('An account with this email already exists.'); 
        }
      }).catch(error => {
        console.error('Error checking email existence:', error);
        reject(error); 
      });
    });
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

  logout() {
    return from(this.auth.signOut()).pipe(
      tap(() => {
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


