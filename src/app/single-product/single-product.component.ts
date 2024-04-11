import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  constructor(private route: ActivatedRoute, private apiService: ApiService, private userService: UserService) {}

  get isLogged(): boolean {
    return this.userService.isLogged;
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
}
