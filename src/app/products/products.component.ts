import { Component, OnInit } from '@angular/core';
import { Product } from '../types/products';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  showFullDescription: boolean = false;
  toggleDescription() {
    this.showFullDescription = !this.showFullDescription;
  }

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.apiService.getData().subscribe((data: Product[]) => {
      console.log(data); // Извеждане на данните в конзолата
      this.products = data;
    });
  }
}