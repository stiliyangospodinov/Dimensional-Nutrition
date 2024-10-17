import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { Product } from '../types/products';
import { ApiService } from '../api.service';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  styleUrls: ['./single-product.component.css']
})
export class SingleProductComponent implements OnInit {
  product: Product | undefined;
  isLoading: boolean = true;
  productName: string | undefined;

  constructor(private route: ActivatedRoute, private apiService: ApiService, private userService: UserService, private router: Router) {}

  get isLogged(): boolean {
    return this.userService.isLogged;
  }
  get isAdmin(): boolean {
    return this.userService.isAdmin();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productName = params['name'];
      if (productName) {
        this.apiService.getProductByName(productName).subscribe((data: Product) => {
          this.product = data;
          this.isLoading = false;
          console.log(productName);
          
        });
      }
    });
  }
  deleteProduct(): void {
    if (this.product && this.product.name) {
      const confirmDelete = confirm('Are you sure you want to delete this product?');
  
      if (confirmDelete) {
        this.apiService.deleteProduct(this.product.name).subscribe(
          () => {
            console.log('Product deleted successfully');
            this.router.navigate(['/products']); 
          },
          error => {
            console.error('Error deleting product:', error);
          }
        );
      }
    }
  }
}  