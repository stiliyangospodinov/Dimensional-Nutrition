import { Injectable } from '@angular/core';
import { AngularFirestore} from '@angular/fire/compat/firestore';
import { Product } from './types/products';
import { User } from './types/user';
import { Observable, catchError, filter, from, map, of, switchMap, throwError } from 'rxjs';
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
  updateProduct(productName: string, productData: Partial<Product>): Observable<void> {
    return new Observable<void>((observer) => {
      this.firestore
        .collection<Product>('products ', ref => ref.where('name', '==', productName))
        .get()
        .toPromise()
        .then((snapshot) => {
          console.log('Snapshot:', snapshot); // Лог на snapshot
  
          if (snapshot && !snapshot.empty) {
            const doc = snapshot.docs[0]; // Вземи първия намерен документ
            console.log('Updating document ID:', doc.id); // Лог на ID на документа
            return doc.ref.update(productData); // Актуализирай документа
          } else {
            console.error('Product not found in snapshot.'); // Лог при ненамиране
            observer.error(new Error('Product not found for update')); // Продуктът не е намерен
            return; // Връщане, за да завърши функцията
          }
        })
        .then(() => {
          observer.next(); // Уведомление за успешна актуализация
          observer.complete(); // Завършване на observable
        })
        .catch((error) => {
          console.error('Error during update:', error); // Лог при грешка
          observer.error(error); // Уведомление за грешка
        });
    });
  }
  deleteProduct(productName: string): Observable<void> {
    return new Observable<void>((observer) => {
      this.firestore
        .collection<Product>('products ', ref => ref.where('name', '==', productName))
        .get()
        .toPromise()
        .then((snapshot) => {
          if (snapshot && !snapshot.empty) {
            const doc = snapshot.docs[0]; // Вземи първия намерен документ
            return doc.ref.delete(); // Изтрий документа
          } else {
            observer.error(new Error('Product not found for deletion'));
            return; // Излизане от метода
          }
        })
        .then(() => {
          observer.next(); // Уведомление за успешна операция
          observer.complete(); // Завършване на observable
        })
        .catch((error) => {
          observer.error(error); // Уведомление за грешка
        });
    });
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





