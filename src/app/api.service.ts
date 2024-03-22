import { Injectable } from '@angular/core';
import { AngularFirestore} from '@angular/fire/compat/firestore';
import { Product } from './types/products';
import { User } from './types/user';
import { Observable, catchError, from, map, throwError } from 'rxjs';
import { Discount } from './types/discount';
import { Comment } from './types/comment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private firestore: AngularFirestore) {}

  getData() {
    return this.firestore
    .collection<Product>("products ")
    .valueChanges();
  }
  getDiscount(): Observable<Discount | undefined> {
    return this.firestore.doc<Discount>(`discount/disc`).valueChanges();
  }
  getComments() {
    return this.firestore
    .collection<Comment>("comments")
    .valueChanges();
  }
  postComment(comment: Comment): Observable<string> {
    const commentsCollection = this.firestore.collection<Comment>('comments');

    return from(commentsCollection.add(comment)).pipe(
      map((docRef) => docRef.id),
      catchError(error => {
        console.error('Error adding comment: ', error);
        return throwError(error);
      }) 
    );
  }

}


