import { Component, OnInit } from '@angular/core';
import { Product } from '../types/products';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  isLoading: boolean = true;
  showFullDescription: boolean = false;
  toggleDescription() {
    this.showFullDescription = !this.showFullDescription;
  }

  constructor(private apiService: ApiService, private router: Router, private userService: UserService) {}
  get isLogged(): boolean {
    return this.userService.isLogged;
  }
  ngOnInit(): void {
    this.apiService.getData().subscribe(
      (data: Product[]) => {
        console.log(data);
        this.products = data;
        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
        console.error(`Error: ${err}`);
      }
    );
  }
}