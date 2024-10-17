import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';
import { Product } from '../types/products';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  form!: FormGroup;
  product!: Product;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Инициализация на формата
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      img: [''],
      price: ['', [Validators.required, Validators.min(0)]],
      tag1: [''],
      tag2: [''],
      tag3: [''],
      description: [''],
      rating: ['', [Validators.required, Validators.min(0), Validators.max(5)]],
    });

    // Взимане на името на продукта от URL
    const productName = this.route.snapshot.paramMap.get('name');

    // Получаване на данните за продукта по име
    if (productName) {
      this.apiService.getProductByName(productName).subscribe((product: Product) => {
        this.product = product;
        this.form.patchValue(product); // Попълване на формата с данни на продукта
      }, (error) => {
        console.error('Error fetching product: ', error);
      });
    }
  }
  
  editProduct(): void {
    if (this.form.valid) {
      const updatedProduct: Partial<Product> = {
        ...this.form.value,
      };
  
      // Увери се, че имаш името на продукта
      if (this.product && this.product.name) {
        console.log('Updating product with name:', this.product.name); // Логиране на името на продукта
        console.log('Updated product data:', updatedProduct); // Логиране на данните за обновяване
        
        this.apiService.updateProduct(this.product.name, updatedProduct).subscribe(() => {
          this.router.navigate(['/products']);
        }, (error) => {
          console.error('Error updating product: ', error);
        });
      } else {
        console.error('Product name is undefined. Cannot update.');
      }
    }
  }
  
  
}
