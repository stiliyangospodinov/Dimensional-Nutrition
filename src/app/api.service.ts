import { Injectable } from '@angular/core';
import { AngularFirestore} from '@angular/fire/compat/firestore';
import { Product } from './types/products';
import { User } from './types/user';
import { Observable, catchError, filter, from, map, throwError } from 'rxjs';
import { Discount } from './types/discount';
import { Comment } from './types/comment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private firestore: AngularFirestore) {}

  getData(): Observable<Product[]> {
    return this.firestore
      .collection<Product>("products ")
      .valueChanges();
  }
  getProductByName(productName: string): Observable<Product> {
    return this.firestore
      .collection<Product>('products ', ref => ref.where('name', '==', productName))
      .valueChanges()
      .pipe(
        map((products: Product[]) => {
          if (products.length > 0) {
            return products[0];
          } else {
            throw new Error('Product not found');
          }
        })
      );
  }
  getDiscountUser(): Observable<Discount | undefined> {
    return this.firestore.doc<Discount>(`discount/disc`).valueChanges();
  }
  getDiscountGuest(): Observable<Discount | undefined> {
    return this.firestore.doc<Discount>(`discount/disc_guest`).valueChanges();
  }
  getComments(): Observable<Comment[]> {
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
  deleteComment(commentId: string): Observable<void> {
    const commentDoc = this.firestore.doc<Comment>(`comments/${commentId}`);

    return from(commentDoc.delete()).pipe(
      catchError(error => {
        console.error('Error deleting comment: ', error);
        return throwError(error);
      }) 
    );
  }
}





