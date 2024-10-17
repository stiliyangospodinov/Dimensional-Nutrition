import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css'],
})
export class CreateProductComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private firestore: AngularFirestore, private router: Router) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      img: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      tag1: [''],
      tag2: [''],
      tag3: [''],
      description: ['', [Validators.required, Validators.minLength(10)]],
      rating: [null, [Validators.required, Validators.min(0), Validators.max(5)]],
    });
  }

  createProduct(): void {
    if (this.form.invalid) {
      return;
    }
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    const productData = {
      ...this.form.value,
      posted: formattedDate 
    };

    this.firestore.collection('products ').add(productData)
      .then(() => {
        alert('Product created successfully!');
        this.router.navigate(['/products']); 
      })
      .catch((error) => {
        console.error('Error adding product:', error);
      });
  }
}
